import { useState, useEffect } from "react";
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
  ExternalLink,
  Activity,
  TrendingUp,
  CreditCard,
  DollarSign,
  BarChart2,
  ChevronDown,
  Menu,
  X,
  Settings,
  Zap,
  Smartphone
} from "lucide-react";

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


// Simulated account data
const accountActivity = [
  { date: "2025-07-23", amount: 1250, type: "deposit" },
  { date: "2025-07-20", amount: -75.20, type: "withdrawal" },
  { date: "2025-07-17", amount: -120, type: "payment" },
  { date: "2025-07-15", amount: -34.50, type: "payment" },
  { date: "2025-07-10", amount: 2800, type: "deposit" },
  { date: "2025-07-05", amount: -65, type: "withdrawal" },
  { date: "2025-07-01", amount: -210, type: "payment" }
];

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("account");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");

      if (!storedUserData) {
        throw new Error("No user data found");
      }

      const parsedUserData: UserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load user profile"
      );
      setIsLoading(false);
    }
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  const getTimeSince = (dateString) => {
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

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const groupPermissionsByCategory = (permissions) => {
    const grouped = {};

    permissions.forEach(rp => {
      const perm = rp.permissions;
      const parts = perm.title.split('_');
      let category = 'General';

      if (parts.length >= 2 && parts[0] === 'can') {
        const entityParts = parts.slice(1);

        const entities = ['user', 'view', 'manage', 'execute', 'payment', 'account', 'profile', 'dashboard', 'transaction', 'report', 'card'];
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

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const formatPermissionTitle = (title) => {
    let formatted = title.replace(/^can_/, '').replace(/_/g, ' ');

    formatted = formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return formatted;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 mb-4 relative">
            <div className="animate-ping absolute h-full w-full rounded-full bg-indigo-400 opacity-75"></div>
            <div className="relative h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-indigo-300 text-lg font-light">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-medium text-white mb-2">Unable to load profile</h2>
            <p className="text-gray-400 text-sm mb-6">{error || 'User data not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/50"
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

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900 text-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-200"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="h-full w-4/5 max-w-xs bg-gray-900 p-6 flex flex-col">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-900/40">
                  {userData.profile_picture ? (
                    <img 
                      src={userData.profile_picture} 
                      alt={`${userData.first_name} ${userData.last_name}`}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-white">
                      {getInitials(userData.first_name, userData.last_name)}
                    </span>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-gray-900"></div>
                </div>
              </div>
              <h2 className="text-xl font-medium text-white">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="text-indigo-300 text-sm mt-1">{userData.email}</p>
            </div>
            
            <nav className="flex-grow">
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setActiveSection("account");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl ${
                    activeSection === "account"
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                      : "text-gray-400 hover:bg-gray-800/50"
                  } transition-colors`}
                >
                  <User className={`h-5 w-5 mr-3 ${activeSection === "account" ? "text-indigo-400" : "text-gray-500"}`} />
                  <span>Account</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveSection("security");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl ${
                    activeSection === "security"
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                      : "text-gray-400 hover:bg-gray-800/50"
                  } transition-colors`}
                >
                  <Lock className={`h-5 w-5 mr-3 ${activeSection === "security" ? "text-indigo-400" : "text-gray-500"}`} />
                  <span>Security</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveSection("permissions");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl ${
                    activeSection === "permissions"
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                      : "text-gray-400 hover:bg-gray-800/50"
                  } transition-colors`}
                >
                  <Shield className={`h-5 w-5 mr-3 ${activeSection === "permissions" ? "text-indigo-400" : "text-gray-500"}`} />
                  <span>Access</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveSection("activity");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl ${
                    activeSection === "activity"
                      ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                      : "text-gray-400 hover:bg-gray-800/50"
                  } transition-colors`}
                >
                  <Activity className={`h-5 w-5 mr-3 ${activeSection === "activity" ? "text-indigo-400" : "text-gray-500"}`} />
                  <span>Activity</span>
                </button>
              </div>
            </nav>
            
            <button className="mt-8 w-full flex items-center justify-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 border border-red-900/50 transition-all">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - desktop only */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-8 self-start">
            {/* Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-700/50">
              <div className="relative">
                {/* Background pattern */}
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.1">
                      <circle cx="50" cy="50" r="100" fill="url(#paint0_radial)" />
                      <circle cx="350" cy="50" r="100" fill="url(#paint1_radial)" />
                      <circle cx="350" cy="150" r="100" fill="url(#paint2_radial)" />
                      <circle cx="50" cy="150" r="100" fill="url(#paint3_radial)" />
                    </g>
                    <defs>
                      <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(50 50) rotate(90) scale(100)">
                        <stop stopColor="#6366F1" />
                        <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(350 50) rotate(90) scale(100)">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientTransform="translate(350 150) rotate(90) scale(100)">
                        <stop stopColor="#EC4899" />
                        <stop offset="1" stopColor="#EC4899" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientTransform="translate(50 150) rotate(90) scale(100)">
                        <stop stopColor="#3B82F6" />
                        <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                <div className="relative pt-8 px-6 pb-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-900/40">
                      {userData.profile_picture ? (
                        <img 
                          src={userData.profile_picture} 
                          alt={`${userData.first_name} ${userData.last_name}`}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-white">
                          {getInitials(userData.first_name, userData.last_name)}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-gray-800"></div>
                  </div>
                  <h2 className="text-xl font-medium text-white">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-indigo-300 text-sm mt-1">{userData.email}</p>

                  <div className="mt-4 w-full">
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-sm rounded-full">
                        {userData.role.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/80">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl">
                    <Clock className="h-5 w-5 text-indigo-400 mb-1" />
                    <span className="text-xs text-gray-400">Last login</span>
                    <span className="text-sm text-white font-medium">
                      {getTimeSince(userData.last_login)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl">
                    <Calendar className="h-5 w-5 text-indigo-400 mb-1" />
                    <span className="text-xs text-gray-400">Member since</span>
                    <span className="text-sm text-white font-medium">
                      {formatDate(userData.createdAt).split(',')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
              <nav className="p-2">
                <div className="space-y-1.5">
                  <button
                    onClick={() => setActiveSection("account")}
                    className={`w-full flex items-center px-4 py-3 rounded-xl ${
                      activeSection === "account"
                        ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                        : "text-gray-400 hover:bg-gray-800/50"
                    } transition-colors`}
                  >
                    <User className={`h-5 w-5 mr-3 ${activeSection === "account" ? "text-indigo-400" : "text-gray-500"}`} />
                    <span>Account</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection("security")}
                    className={`w-full flex items-center px-4 py-3 rounded-xl ${
                      activeSection === "security"
                        ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                        : "text-gray-400 hover:bg-gray-800/50"
                    } transition-colors`}
                  >
                    <Lock className={`h-5 w-5 mr-3 ${activeSection === "security" ? "text-indigo-400" : "text-gray-500"}`} />
                    <span>Security</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection("permissions")}
                    className={`w-full flex items-center px-4 py-3 rounded-xl ${
                      activeSection === "permissions"
                        ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                        : "text-gray-400 hover:bg-gray-800/50"
                    } transition-colors`}
                  >
                    <Shield className={`h-5 w-5 mr-3 ${activeSection === "permissions" ? "text-indigo-400" : "text-gray-500"}`} />
                    <span>Access</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection("activity")}
                    className={`w-full flex items-center px-4 py-3 rounded-xl ${
                      activeSection === "activity"
                        ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800"
                        : "text-gray-400 hover:bg-gray-800/50"
                    } transition-colors`}
                  >
                    <Activity className={`h-5 w-5 mr-3 ${activeSection === "activity" ? "text-indigo-400" : "text-gray-500"}`} />
                    <span>Activity</span>
                  </button>
                </div>
              </nav>
              
              <div className="p-4 border-t border-gray-700/50">
                <button 
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 border border-red-900/50 transition-all"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Dashboard Stats - visible on all screens */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-light text-white">My Profile</h1>
                <div className="inline-flex h-8 items-center rounded-full px-4 bg-green-900/20 border border-green-800/30">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-xs text-green-400 font-medium">Online</span>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-white mb-1">
                        {userData.first_name} {userData.last_name}
                      </h2>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-indigo-400 mr-1.5" />
                        <span className="text-gray-300 text-sm">{userData.email}</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-900/40">
                      {userData.profile_picture ? (
                        <img 
                          src={userData.profile_picture} 
                          alt={`${userData.first_name} ${userData.last_name}`} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-white">
                          {getInitials(userData.first_name, userData.last_name)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-700/50">
                      <div className="flex items-center">
                        <Bell className="h-3.5 w-3.5 text-indigo-400 mr-1.5" />
                        <span className="text-xs text-gray-400">Status</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-white">
                        {userData.role.title}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-700/50">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 text-indigo-400 mr-1.5" />
                        <span className="text-xs text-gray-400">Last Login</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-white">
                        {getTimeSince(userData.last_login)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Section */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <div className="hidden lg:block mb-4">
                  <h1 className="text-3xl font-light text-white">My Account</h1>
                  <p className="text-gray-400 mt-1">Manage your personal information</p>
                </div>
                
                {/* Main Account Info Card */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-indigo-400 mr-2.5" />
                      <h2 className="text-xl font-light text-white">Personal Information</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-medium text-indigo-300 mb-1.5">First Name</label>
                          <div className="flex items-center h-12 px-4 rounded-lg bg-gray-900/70 border border-gray-700/70 shadow-inner">
                            <span className="text-gray-200">{userData.first_name}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-indigo-300 mb-1.5">Email Address</label>
                          <div className="flex items-center h-12 px-4 rounded-lg bg-gray-900/70 border border-gray-700/70 shadow-inner">
                            <Mail className="h-4 w-4 text-indigo-400 mr-2" />
                            <span className="text-gray-200">{userData.email}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-indigo-300 mb-1.5">Status</label>
                          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-900/20 border border-green-700/30">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm font-medium text-green-300 capitalize">{userData.account_status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-medium text-indigo-300 mb-1.5">Last Name</label>
                          <div className="flex items-center h-12 px-4 rounded-lg bg-gray-900/70 border border-gray-700/70 shadow-inner">
                            <span className="text-gray-200">{userData.last_name}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-indigo-300 mb-1.5">Phone Number</label>
                          <div className="flex items-center h-12 px-4 rounded-lg bg-gray-900/70 border border-gray-700/70 shadow-inner">
                            <Phone className="h-4 w-4 text-indigo-400 mr-2" />
                            <span className="text-gray-200">{userData.phone_number}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-indigo-300 mb-1.5">Membership Type</label>
                          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-900/20 border border-indigo-700/30">
                            <Shield className="h-4 w-4 text-indigo-400 mr-2" />
                            <span className="text-sm font-medium text-indigo-300">{userData.role.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-300">Account Timeline</h3>
                        <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                          <span>View All</span>
                          <ChevronRight className="h-4 w-4 ml-0.5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-700 flex items-center justify-center">
                              <User className="h-4 w-4 text-indigo-400" />
                            </div>
                            <div className="w-0.5 h-12 bg-gray-700"></div>
                          </div>
                          <div className="flex-grow p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                            <p className="text-sm text-gray-300">Account created</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(userData.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-8 h-8 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-green-400" />
                            </div>
                            <div className="w-0.5 h-12 bg-gray-700"></div>
                          </div>
                          <div className="flex-grow p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                            <p className="text-sm text-gray-300">Upgraded to {userData.role.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(new Date(userData.updatedAt).setDate(new Date(userData.updatedAt).getDate() - 30))}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center">
                              <Key className="h-4 w-4 text-blue-400" />
                            </div>
                          </div>
                          <div className="flex-grow p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                            <p className="text-sm text-gray-300">Password reset</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(userData.last_password_reset)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/30 flex items-center">
                        <Edit className="h-4 w-4 mr-1.5" />
                        Edit Information
                      </button>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 backdrop-blur-md rounded-2xl border border-indigo-800/30 shadow-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-indigo-300 mb-1">Account Age</p>
                        <h3 className="text-2xl font-medium text-white">
                          {Math.floor((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-indigo-800/50 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-indigo-300" />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-indigo-300/70">
                      Member since {formatDate(userData.createdAt)}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/20 backdrop-blur-md rounded-2xl border border-violet-800/30 shadow-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-violet-300 mb-1">Last Update</p>
                        <h3 className="text-2xl font-medium text-white">
                          {getTimeSince(userData.updatedAt)}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-violet-800/50 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-violet-300" />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-violet-300/70">
                      Account updated on {formatDate(userData.updatedAt)}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 backdrop-blur-md rounded-2xl border border-blue-800/30 shadow-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-blue-300 mb-1">Active Sessions</p>
                        <h3 className="text-2xl font-medium text-white">1 device</h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-800/50 flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-blue-300" />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-blue-300/70">
                      Last login {getTimeSince(userData.last_login)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="hidden lg:block mb-4">
                  <h1 className="text-3xl font-light text-white">Security & Login</h1>
                  <p className="text-gray-400 mt-1">Manage your account security settings</p>
                </div>
                
                {/* Current Session */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center">
                    <Clock className="h-5 w-5 text-indigo-400 mr-2.5" />
                    <h2 className="text-xl font-light text-white">Login Activity</h2>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-xl bg-green-900/20 border border-green-700/30 flex items-center justify-center mr-5 flex-shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg text-white font-medium mb-1">Current Session</h3>
                          <p className="text-gray-400 text-sm">Last activity {getTimeSince(userData.last_login)}</p>

                          <div className="flex mt-4 items-center text-xs text-gray-400">
                            <div className="flex items-center pr-3 mr-3 border-r border-gray-700">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                              Active Now
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-300 mr-1">IP Address:</span>
                              192.168.1.1
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center text-xs text-gray-400">
                            <div className="flex items-center pr-3 mr-3 border-r border-gray-700">
                              <span className="text-gray-300 mr-1">Device:</span>
                              Chrome on Windows
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-300 mr-1">Location:</span>
                              Nairobi, Kenya
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 px-4 py-2 text-xs text-red-400 font-medium border border-red-900/50 hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                          End Session
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-base font-medium text-white mb-3">Recent Login Activity</h3>
                      
                      <div className="space-y-3">
                        {[
                          { device: "Chrome on Windows", location: "Nairobi, Kenya", time: "Just now", active: true },
                          { device: "Safari on iPhone", location: "Nairobi, Kenya", time: "2 days ago", active: false },
                          { device: "Firefox on Mac", location: "Mombasa, Kenya", time: "1 week ago", active: false }
                        ].map((session, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-900/30 border border-gray-700/50"
                          >
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-lg ${
                                session.active ? "bg-green-900/20 border-green-700/30" : "bg-gray-800 border-gray-700"
                              } border flex items-center justify-center mr-4`}>
                                {session.device.includes("Chrome") ? (
                                  <ChromeIcon className="h-5 w-5 text-blue-400" />
                                ) : session.device.includes("Safari") ? (
                                  <SafariIcon className="h-5 w-5 text-indigo-400" />
                                ) : (
                                  <FirefoxIcon className="h-5 w-5 text-orange-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-gray-200 text-sm">{session.device}</p>
                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                    {session.location}
                                  </div>
                                  <span className="mx-2">•</span>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                    {session.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {session.active ? (
                              <div className="flex items-center text-xs text-green-400 font-medium">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                Current
                              </div>
                            ) : (
                              <button className="text-xs text-red-400 hover:text-red-300">Remove</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Management */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center">
                    <Key className="h-5 w-5 text-indigo-400 mr-2.5" />
                    <h2 className="text-xl font-light text-white">Password Management</h2>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg text-white font-medium mb-1">Password</h3>
                          <p className="text-gray-400 text-sm">Last changed {getTimeSince(userData.last_password_reset)}</p>
                        </div>
                        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/30">
                          Change Password
                        </button>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center mb-2">
                          <p className="text-gray-300 text-sm mr-3">Password Strength</p>
                          <div className="text-xs px-2 py-0.5 rounded-md bg-green-900/20 text-green-400 border border-green-700/30">
                            Strong
                          </div>
                        </div>
                        
                        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{width: "85%"}}></div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-gray-800/70 border border-gray-700">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Contains uppercase</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/70 border border-gray-700">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Contains number</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/70 border border-gray-700">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-300">Contains symbol</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2FA */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center">
                    <Shield className="h-5 w-5 text-indigo-400 mr-2.5" />
                    <h2 className="text-xl font-light text-white">Two-Factor Authentication</h2>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-xl bg-amber-900/20 border border-amber-700/30 flex items-center justify-center mr-5 flex-shrink-0">
                          <AlertCircle className="h-6 w-6 text-amber-500" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg text-white font-medium mb-1">Not Enabled</h3>
                          <p className="text-gray-400 text-sm mb-4">Add an extra layer of security to your account by requiring both your password and a verification code.</p>
                          
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
                              <Smartphone className="h-4 w-4 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-300">Authenticator App</span>
                            </div>
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
                              <Mail className="h-4 w-4 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-300">Email Code</span>
                            </div>
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
                              <Phone className="h-4 w-4 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-300">SMS Verification</span>
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 px-4 py-2.5 text-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-900/30 flex-shrink-0">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Section */}
            {activeSection === "permissions" && (
              <div className="space-y-6">
                <div className="hidden lg:block mb-4">
                  <h1 className="text-3xl font-light text-white">Access & Permissions</h1>
                  <p className="text-gray-400 mt-1">View your role and permissions</p>
                </div>
                
                {/* Role Information */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-indigo-400 mr-2.5" />
                      <h2 className="text-xl font-light text-white">Role & Permissions</h2>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-indigo-900/30 border border-indigo-700/50">
                      <span className="text-sm font-medium text-indigo-300">{userData.role.title}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start p-5 bg-gray-900/40 rounded-xl mb-6 border border-gray-700/50">
                      <div className="w-12 h-12 rounded-xl bg-indigo-900/20 flex items-center justify-center mr-5 flex-shrink-0 border border-indigo-700/30">
                        <Shield className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium mb-1">Role-Based Access Control</p>
                        <p className="text-gray-400 text-sm">Your access is determined by your role: <span className="font-medium text-indigo-400">{userData.role.title}</span>. The permissions below outline what actions you can perform in the system.</p>
                      </div>
                    </div>

                    {/* Permissions Overview */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium text-white">Permissions Overview</h3>
                        <div className="flex items-center text-sm">
                          <span className="text-indigo-400 font-medium mr-1">{Object.values(groupedPermissions).flat().length}</span>
                          <span className="text-gray-400">total permissions</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                          <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                              expandedCategories[category]
                                ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50"
                                : "bg-gray-800/70 text-gray-300 border border-gray-700 hover:bg-gray-800"
                            }`}
                          >
                            <span>{category}</span>
                            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ml-2 ${
                              expandedCategories[category]
                                ? "bg-indigo-800 text-indigo-300"
                                : "bg-gray-700 text-gray-300"
                            }`}>{perms?.length}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        expandedCategories[category] && (
                          <div key={category} className="rounded-xl overflow-hidden">
                            <div className="bg-gray-800/80 px-6 py-4 border border-gray-700/70 rounded-t-xl">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-900/30 flex items-center justify-center mr-3 border border-indigo-700/30">
                                    {category === "View" ? (
                                      <Eye className="h-4 w-4 text-indigo-400" />
                                    ) : category === "Manage" ? (
                                      <Settings className="h-4 w-4 text-indigo-400" />
                                    ) : category === "Execute" ? (
                                      <Zap className="h-4 w-4 text-indigo-400" />
                                    ) : category === "Dashboard" ? (
                                      <BarChart2 className="h-4 w-4 text-indigo-400" />
                                    ) : category === "Transaction" ? (
                                      <DollarSign className="h-4 w-4 text-indigo-400" />
                                    ) : (
                                      <Shield className="h-4 w-4 text-indigo-400" />
                                    )}
                                  </div>
                                  <h3 className="font-medium text-white">{category} Permissions</h3>
                                </div>
                                <button
                                  onClick={() => toggleCategory(category)}
                                  className="text-gray-400 hover:text-gray-300 p-1 rounded-full"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            <div className="p-5 border border-t-0 border-gray-700/70 rounded-b-xl bg-gray-900/40">
                              <div className="flex flex-wrap gap-2">
                                {(permissions as Array<{ id: number; title: string }>).map((permission) => {
                                  // Extract action from permission title (e.g., "view", "edit", "delete")
                                  const permTitle = permission.title;
                                  let actionType = "view"; // default

                                  if (permTitle.includes("create") || permTitle.includes("add")) {
                                    actionType = "create";
                                  } else if (permTitle.includes("edit") || permTitle.includes("update") || permTitle.includes("manage")) {
                                    actionType = "edit";
                                  } else if (permTitle.includes("delete") || permTitle.includes("remove")) {
                                    actionType = "delete";
                                  } else if (permTitle.includes("execute") || permTitle.includes("payment")) {
                                    actionType = "execute";
                                  }

                                  // Determine color based on action type
                                  const colors = {
                                    view: "bg-blue-900/30 text-blue-300 border-blue-800/50",
                                    create: "bg-green-900/30 text-green-300 border-green-800/50",
                                    edit: "bg-amber-900/30 text-amber-300 border-amber-800/50",
                                    execute: "bg-violet-900/30 text-violet-300 border-violet-800/50",
                                    delete: "bg-red-900/30 text-red-300 border-red-800/50"
                                  };

                                  return (
                                    <div
                                      key={permission.id}
                                      className={`px-3 py-2 rounded-lg border text-sm ${colors[actionType]}`}
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

                      {Object.values(expandedCategories).every(expanded => !expanded) && (
                        <div className="bg-gray-900/40 rounded-xl p-8 text-center border border-gray-700/50">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-900/20 rounded-xl mb-4 border border-indigo-700/30">
                            <Shield className="h-8 w-8 text-indigo-400" />
                          </div>
                          <h4 className="text-lg text-gray-200 font-medium mb-2">Select a permission category</h4>
                          <p className="text-gray-400 text-sm max-w-md mx-auto">
                            Click on any of the permission categories above to view the detailed permissions for that section.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Access Management */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center">
                    <Key className="h-5 w-5 text-indigo-400 mr-2.5" />
                    <h2 className="text-xl font-light text-white">Access Management</h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col h-full p-5 rounded-xl bg-gray-900/40 border border-gray-700/50">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-green-900/20 flex items-center justify-center mr-4 border border-green-700/30">
                            <DollarSign className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Transaction Limits</h3>
                            <p className="text-gray-400 text-xs mt-0.5">Based on your {userData.role.title} role</p>
                          </div>
                        </div>
                        
                        <div className="flex-grow flex flex-col space-y-3 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Daily limit:</span>
                            <span className="text-sm text-white font-medium">$10,000</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Monthly limit:</span>
                            <span className="text-sm text-white font-medium">$100,000</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Per transaction:</span>
                            <span className="text-sm text-white font-medium">$5,000</span>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Status:</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/30">
                                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></span>
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col h-full p-5 rounded-xl bg-gray-900/40 border border-gray-700/50">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-900/20 flex items-center justify-center mr-4 border border-indigo-700/30">
                            <Bell className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Access Notifications</h3>
                            <p className="text-gray-400 text-xs mt-0.5">Email alerts for account access</p>
                          </div>
                        </div>
                        
                        <div className="flex-grow space-y-3 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300 flex items-center">
                              <Lock className="h-4 w-4 mr-1.5 text-indigo-400" />
                              New login alert
                            </span>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
                              <span className="absolute h-4 w-4 transform rounded-full bg-white transition"></span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300 flex items-center">
                              <Key className="h-4 w-4 mr-1.5 text-indigo-400" />
                              Password change
                            </span>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                              <span className="absolute h-4 w-4 transform translate-x-5 rounded-full bg-white transition"></span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300 flex items-center">
                              <Shield className="h-4 w-4 mr-1.5 text-indigo-400" />
                              Permission changes
                            </span>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                              <span className="absolute h-4 w-4 transform translate-x-5 rounded-full bg-white transition"></span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <button className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-indigo-300 hover:text-indigo-200 border border-indigo-800/50 hover:bg-indigo-900/30 transition-colors">
                              <Settings className="h-4 w-4 mr-1.5" />
                              Configure Notifications
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-5 border border-gray-700/50 rounded-xl bg-gray-900/40">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-violet-900/20 flex items-center justify-center mr-4 border border-violet-700/30">
                          <Plus className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Need Additional Access?</h4>
                          <p className="text-gray-400 text-sm mt-1">Contact your system administrator if you require additional permissions.</p>
                        </div>
                        <button className="ml-auto px-4 py-2 text-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-900/30">
                          Request Access
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Activity Section */}
            {activeSection === "activity" && (
              <div className="space-y-6">
                <div className="hidden lg:block mb-4">
                  <h1 className="text-3xl font-light text-white">Account Activity</h1>
                  <p className="text-gray-400 mt-1">View your recent account activity and transactions</p>
                </div>
                
                {/* Activity Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-900/20 flex items-center justify-center mr-4 border border-blue-700/30">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total Transactions</p>
                        <h3 className="text-xl font-medium text-white">24</h3>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: "65%"}}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Last 30 days</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-900/20 flex items-center justify-center mr-4 border border-green-700/30">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total Deposits</p>
                        <h3 className="text-xl font-medium text-white">$4,050</h3>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{width: "40%"}}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Last 30 days</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center mr-4 border border-red-700/30">
                        <ArrowDown className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total Withdrawals</p>
                        <h3 className="text-xl font-medium text-white">$504.70</h3>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{width: "25%"}}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Last 30 days</p>
                    </div>
                  </div>
                </div>
                
                {/* Activity Chart */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart2 className="h-5 w-5 text-indigo-400 mr-2.5" />
                      <h2 className="text-xl font-light text-white">Activity Overview</h2>
                    </div>
                    <div className="flex items-center">
                      <select className="bg-gray-900/70 border border-gray-700 rounded-lg text-sm text-gray-300 py-1.5 px-3">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="h-64 w-full relative">
                      {/* Simulated chart */}
                      <div className="absolute inset-0">
                        <div className="flex items-end justify-between h-full pt-8">
                          {accountActivity.map((item, index) => {
                            const height = Math.abs(item.amount) / 30;
                            const isPositive = item.amount > 0;
                            return (
                              <div key={index} className="relative flex flex-col items-center h-full w-1/7">
                                <div
                                  className={`w-12 rounded-t-md ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                                  style={{ height: `${height}%` }}
                                ></div>
                                <p className="absolute -bottom-6 text-xs text-gray-400">{formatDate(item.date).split(',')[0]}</p>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between py-4 text-right">
                          <span className="text-xs text-gray-500">$3000</span>
                          <span className="text-xs text-gray-500">$1500</span>
                          <span className="text-xs text-gray-500">$0</span>
                          <span className="text-xs text-gray-500">-$500</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 grid grid-cols-3 gap-4">
                      <div className="flex items-center p-3 rounded-lg bg-gray-900/40 border border-gray-700/50">
                        <div className="w-8 h-8 rounded-lg bg-green-900/20 flex items-center justify-center mr-3 border border-green-700/30">
                          <ArrowUp className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Deposits</p>
                          <p className="text-sm font-medium text-white">$4,050.00</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-gray-900/40 border border-gray-700/50">
                        <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center mr-3 border border-red-700/30">
                          <ArrowDown className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Withdrawals</p>
                          <p className="text-sm font-medium text-white">$504.70</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-gray-900/40 border border-gray-700/50">
                        <div className="w-8 h-8 rounded-lg bg-blue-900/20 flex items-center justify-center mr-3 border border-blue-700/30">
                          <DollarSign className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Balance</p>
                          <p className="text-sm font-medium text-white">$3,545.30</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Transactions */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-indigo-400 mr-2.5" />
                      <h2 className="text-xl font-light text-white">Recent Transactions</h2>
                    </div>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
                      <span>View All</span>
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      {accountActivity.map((item, index) => (
                        <div key={index} className="flex items-center p-4 rounded-xl bg-gray-900/40 border border-gray-700/50">
                          <div className={`w-10 h-10 rounded-lg ${
                            item.amount > 0 
                              ? "bg-green-900/20 border-green-700/30" 
                              : item.type === "payment" 
                                ? "bg-blue-900/20 border-blue-700/30"
                                : "bg-red-900/20 border-red-700/30"
                          } border flex items-center justify-center mr-4`}>
                            {item.amount > 0 ? (
                              <ArrowUp className="h-5 w-5 text-green-400" />
                            ) : item.type === "payment" ? (
                              <CreditCard className="h-5 w-5 text-blue-400" />
                            ) : (
                              <ArrowDown className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <p className="text-gray-200 font-medium">
                                {item.type === "deposit" ? "Deposit" : item.type === "payment" ? "Payment" : "Withdrawal"}
                              </p>
                              <span className="mx-2 text-gray-500">•</span>
                              <p className="text-gray-400 text-sm">{formatDate(item.date)}</p>
                            </div>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {item.type === "deposit" 
                                ? "Direct Deposit" 
                                : item.type === "payment" 
                                  ? "Online Payment" 
                                  : "ATM Withdrawal"}
                            </p>
                          </div>
                          <p className={`text-right font-medium ${
                            item.amount > 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {item.amount > 0 ? "+" : ""}{item.amount.toLocaleString('en-US', { 
                              style: 'currency', 
                              currency: 'USD',
                              minimumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      ))}
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
}

// Browser icons
const ChromeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2"/>
    <circle cx="12" cy="12" r="4" fill="currentColor"/>
    <path d="M12 16L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SafariIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FirefoxIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2"/>
    <path d="M7 9C7 9 8.5 5 13 5C17.5 5 18 9 18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="15" r="4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const MapPin = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Monitor = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ArrowUp = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const ArrowDown = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const Eye = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

