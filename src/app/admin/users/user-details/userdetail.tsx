import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Clock,
    Calendar,
    MapPin,
    Shield,
    CheckCircle,
    AlertCircle,
    Copy,
    Edit,
    Eye,
    EyeOff,
    CreditCard,
    Activity,
    FileText,
    BellRing,
    HelpCircle,
    Users,
    LogOut,
} from 'lucide-react';

const userService = {
    getUserById: async (id: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    "id": "4648daff-2e59-4679-9dcc-7431033db3b2",
                    "username": null,
                    "first_name": null,
                    "last_name": null,
                    "email": "michaelmagero2@gmail.com",
                    "phone_number": null,
                    "is_verified": false,
                    "kyc_status": false,
                    "city": null,
                    "town": null,
                    "country": "kenya",
                    "about": null,
                    "dob": null,
                    "country_code": null,
                    "gender": null,
                    "passport_photo": null,
                    "avatar_id": null,
                    "identity_type": "national_id",
                    "identity_number": null,
                    "verification_status": "pending",
                    "account_status": "active",
                    "fcm_token": "",
                    "last_login": null,
                    "id_front": null,
                    "id_back": null,
                    "profile_picture": null,
                    "profile_background": null,
                    "createdAt": "2025-05-01T08:16:31.616Z",
                    "updatedAt": "2025-05-01T08:16:31.616Z",
                    "deletedAt": null
                });
            }, 800);
        });
    },

    getUserWallets: async (userId: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: "wallet1",
                        type: "personal",
                        currency: "KES",
                        balance: "2,500.00",
                        status: "active",
                        createdAt: "2025-05-01T10:20:15.616Z"
                    },
                    {
                        id: "wallet2",
                        type: "group",
                        currency: "USD",
                        balance: "150.00",
                        status: "active",
                        createdAt: "2025-05-03T14:22:11.616Z"
                    }
                ]);
            }, 1000);
        });
    },

    getUserActivity: async (userId: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: "act1",
                        type: "login",
                        description: "Logged in from new device",
                        timestamp: "2025-05-07T09:12:31.616Z",
                        ip: "41.89.128.201",
                        device: "iPhone 16, iOS 18.2"
                    },
                    {
                        id: "act2",
                        type: "wallet",
                        description: "Wallet created",
                        timestamp: "2025-05-03T14:22:11.616Z",
                        ip: "41.89.128.201",
                        device: "Chrome on macOS"
                    },
                    {
                        id: "act3",
                        type: "profile",
                        description: "Email verified",
                        timestamp: "2025-05-01T08:20:45.616Z",
                        ip: "41.89.128.201",
                        device: "Chrome on macOS"
                    }
                ]);
            }, 1200);
        });
    }
};

interface Wallet {
    id: string;
    type: string;
    currency: string;
    balance: string;
    status: string;
    createdAt: string;
}

interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    ip: string;
    device: string;
}

// Helper functions
const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    try {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
        return 'Invalid date';
    }
};

const formatTime = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
        return '';
    }
};

const timeAgo = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

interface SectionHeaderProps {
    title: string;
    children?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, children = null }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {children}
    </div>
);

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    copyable?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon, copyable = false }) => (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
        {icon && <div className="text-gray-400 mr-3">{icon}</div>}
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="flex items-center">
                <p className="text-base font-medium text-gray-800">{value || 'Not set'}</p>
                {copyable && (
                    <button className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-300">
                        <Copy size={14} className="text-gray-500" />
                    </button>
                )}
            </div>
        </div>
    </div>
);

interface StatusBadgeProps {
    status: string;
    type?: 'verification' | 'account' | 'kyc';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'account' }) => {
    const statusColors = {
        active: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        inactive: 'bg-gray-100 text-gray-700',
        suspended: 'bg-red-100 text-red-700',
        verified: 'bg-green-100 text-green-700',
        unverified: 'bg-gray-100 text-gray-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const statusIcons = {
        active: <CheckCircle size={14} className="mr-1" />,
        pending: <Clock size={14} className="mr-1" />,
        inactive: <AlertCircle size={14} className="mr-1" />,
        suspended: <AlertCircle size={14} className="mr-1" />,
        verified: <CheckCircle size={14} className="mr-1" />,
        unverified: <AlertCircle size={14} className="mr-1" />,
        rejected: <AlertCircle size={14} className="mr-1" />,
    };

    // @ts-ignore - dynamic access
    const color = statusColors[status] || 'bg-gray-100 text-gray-700';
    // @ts-ignore - dynamic access
    const icon = statusIcons[status] || <HelpCircle size={14} className="mr-1" />;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {icon}
            {status}
        </span>
    );
};

const userdetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [showId, setShowId] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                if (!id) {
                    throw new Error("User ID is missing");
                }

                const userData = await userService.getUserById(id);
                setUser(userData);

                // Fetch user wallets
                const walletsData = await userService.getUserWallets(id) as Wallet[];
                setWallets(walletsData);

                // Fetch user activity
                const activityData = await userService.getUserActivity(id) as Activity[];
                setActivities(activityData);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
                setError("Failed to load user details. Please try again.");
                setLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
                    <div className="w-full mx-auto px-6 py-6">
                        <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="w-64 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="w-full mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                                    <div className="w-32 h-6 bg-gray-200 rounded-lg mb-2"></div>
                                    <div className="w-40 h-4 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
                                <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="space-y-4">
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-md p-8 max-w-md backdrop-blur-sm bg-opacity-95">
                    <div className="text-red-500 text-center mb-6">
                        <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Error</h2>
                    </div>
                    <p className="text-gray-600 mb-8 text-center">{error}</p>
                    <div className="flex justify-center">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300"
                            onClick={() => navigate(-1)}
                        >
                            Back to Users
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const userName = user.username || user.first_name
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
        : user.email?.split('@')[0] || 'User';

    const userInitials: string = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
    const userLocation = user.city && user.country
        ? `${user.city}, ${user.country}`
        : user.country || 'Location not set';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
            <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
                <div className="w-full mx-auto px-6 py-6">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                        >
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                            <p className="text-gray-500 mt-1">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <StatusBadge status={user.account_status} type="account" />
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.is_verified ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700'}`}>
                                {user.is_verified
                                    ? <CheckCircle size={14} className="mr-1" />
                                    : <AlertCircle size={14} className="mr-1" />
                                }
                                {user.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Joined {formatDate(user.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100 bg-white bg-opacity-90 backdrop-blur-sm sticky top-24 z-10">
                <div className="w-full mx-auto px-6">
                    <div className="flex overflow-x-auto">
                        <button
                            className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'profile'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'wallets'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('wallets')}
                        >
                            Wallets
                        </button>
                        <button
                            className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'activity'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('activity')}
                        >
                            Activity
                        </button>
                        <button
                            className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'security'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('security')}
                        >
                            Security
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-6 py-8">
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 mb-8">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        {user.profile_picture ? (
                                            <img
                                                src={user.profile_picture}
                                                alt={userName}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                                                {userInitials}
                                            </div>
                                        )}
                                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${user.account_status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mt-4">{userName}</h2>
                                    <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                                    <div className="flex space-x-2 mb-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.account_status}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.kyc_status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {user.kyc_status ? 'KYC Verified' : 'KYC Pending'}
                                        </span>
                                    </div>

                                    <div className="w-full border-t border-gray-100 pt-4 mt-2">
                                        <div className="flex items-center py-2">
                                            <Mail size={16} className="text-gray-400 mr-3" />
                                            <span className="text-gray-600">{user.email}</span>
                                        </div>
                                        {user.phone_number && (
                                            <div className="flex items-center py-2">
                                                <Phone size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-600">{user.phone_number}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center py-2">
                                            <MapPin size={16} className="text-gray-400 mr-3" />
                                            <span className="text-gray-600">{userLocation}</span>
                                        </div>
                                        <div className="flex items-center py-2">
                                            <Calendar size={16} className="text-gray-400 mr-3" />
                                            <span className="text-gray-600">Joined {formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Quick Actions" />
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 group">
                                        <div className="flex items-center">
                                            <CreditCard size={18} className="mr-3 text-primary-500" />
                                            <span className="font-medium">View Wallets</span>
                                        </div>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{wallets.length}</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 group">
                                        <div className="flex items-center">
                                            <BellRing size={18} className="mr-3 text-primary-500" />
                                            <span className="font-medium">Send Notification</span>
                                        </div>
                                    </button>
                                    {user.account_status === 'active' ? (
                                        <button className="w-full flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 hover:bg-red-100 transition-colors duration-300 group">
                                            <div className="flex items-center">
                                                <AlertCircle size={18} className="mr-3" />
                                                <span className="font-medium">Suspend Account</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <button className="w-full flex items-center justify-between px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-green-600 hover:bg-green-100 transition-colors duration-300 group">
                                            <div className="flex items-center">
                                                <CheckCircle size={18} className="mr-3" />
                                                <span className="font-medium">Activate Account</span>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Personal Information">
                                </SectionHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem
                                        label="First Name"
                                        value={user.first_name}
                                        icon={<User size={18} />}
                                    />
                                    <InfoItem
                                        label="Last Name"
                                        value={user.last_name}
                                        icon={<User size={18} />}
                                    />
                                    <InfoItem
                                        label="Email"
                                        value={user.email}
                                        icon={<Mail size={18} />}
                                    />
                                    <InfoItem
                                        label="Phone Number"
                                        value={user.phone_number ? `${user.country_code || ''} ${user.phone_number}` : null}
                                        icon={<Phone size={18} />}
                                    />
                                    <InfoItem
                                        label="Gender"
                                        value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null}
                                        icon={<User size={18} />}
                                    />
                                    <InfoItem
                                        label="Date of Birth"
                                        value={formatDate(user.dob)}
                                        icon={<Calendar size={18} />}
                                    />
                                    <InfoItem
                                        label="Country"
                                        value={user.country ? user.country.charAt(0).toUpperCase() + user.country.slice(1) : null}
                                        icon={<MapPin size={18} />}
                                    />
                                    <InfoItem
                                        label="City"
                                        value={user.city}
                                        icon={<MapPin size={18} />}
                                    />
                                </div>

                                {user.about && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">About</p>
                                        <p className="text-gray-700">{user.about}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Account & Identity Verification">
                                    <button
                                        onClick={() => setShowId(!showId)}
                                        className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                                    >
                                        {showId ? (
                                            <>
                                                <EyeOff size={14} className="mr-1" />
                                                Hide ID Details
                                            </>
                                        ) : (
                                            <>
                                                <Eye size={14} className="mr-1" />
                                                Show ID Details
                                            </>
                                        )}
                                    </button>
                                </SectionHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem
                                        label="Account Status"
                                        value={
                                            <StatusBadge status={user.account_status as string} />
                                        }
                                        icon={<Shield size={18} />}
                                    />
                                    <InfoItem
                                        label="Email Verification"
                                        value={
                                            <StatusBadge status={user.is_verified ? 'verified' : 'unverified'} />
                                        }
                                        icon={<CheckCircle size={18} />}
                                    />
                                    <InfoItem
                                        label="KYC Status"
                                        value={
                                            <StatusBadge status={user.kyc_status ? 'verified' : 'unverified'} type="kyc" />
                                        }
                                        icon={<Shield size={18} />}
                                    />
                                    <InfoItem
                                        label="Identity Type"
                                        value={user.identity_type ? user.identity_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : null}
                                        icon={<FileText size={18} />}
                                    />
                                    {showId && (
                                        <InfoItem
                                            label="Identity Number"
                                            value={user.identity_number as string | null}
                                            icon={<FileText size={18} />}
                                            copyable
                                        />
                                    )}
                                    <InfoItem
                                        label="Verification Status"
                                        value={
                                            <StatusBadge status={user.verification_status as string} type="verification" />
                                        }
                                        icon={<CheckCircle size={18} />}
                                    />
                                    <InfoItem
                                        label="Last Login"
                                        value={user.last_login ? timeAgo(user.last_login) : 'Never'}
                                        icon={<Clock size={18} />}
                                    />
                                </div>

                                {(user.id_front || user.id_back) && showId && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-4">Identity Documents</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {user.id_front && (
                                                <div className="border border-gray-200 rounded-xl p-2">
                                                    <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center relative">
                                                        <img
                                                            src={user.id_front}
                                                            alt="ID Front"
                                                            className="h-full w-full object-contain rounded-lg"
                                                        />
                                                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs font-medium">
                                                            ID Front
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {user.id_back && (
                                                <div className="border border-gray-200 rounded-xl p-2">
                                                    <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center relative">
                                                        <img
                                                            src={user.id_back}
                                                            alt="ID Back"
                                                            className="h-full w-full object-contain rounded-lg"
                                                        />
                                                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs font-medium">
                                                            ID Back
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Account Activity */}
                            <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Recent Activity">
                                    <button
                                        className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                                        onClick={() => setActiveTab('activity')}
                                    >
                                        View All
                                    </button>
                                </SectionHeader>

                                {activities.length > 0 ? (
                                    <div className="space-y-4">
                                        {activities.slice(0, 3).map((activity) => (
                                            <div key={activity.id} className="flex items-start p-4 border border-gray-100 rounded-xl hover:border-primary-100 transition-colors duration-300">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${activity.type === 'login' ? 'bg-primary-100 text-primary-600' :
                                                    activity.type === 'wallet' ? 'bg-green-100 text-green-600' :
                                                        'bg-purple-100 text-purple-600'
                                                    }`}>
                                                    {activity.type === 'login' ? <LogOut size={18} /> :
                                                        activity.type === 'wallet' ? <CreditCard size={18} /> :
                                                            <User size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{activity.description}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {activity.device} • {activity.ip}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                                                            <p className="text-xs text-gray-400">{formatTime(activity.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-gray-50 rounded-xl">
                                        <Activity size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-600 mb-2">No activity found</p>
                                        <p className="text-sm text-gray-500">User activity will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'wallets' && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                        <SectionHeader title="User Wallets">
                            <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center text-sm font-medium">
                                <CreditCard size={16} className="mr-2" />
                                Add Wallet
                            </button>
                        </SectionHeader>

                        {wallets.length > 0 ? (
                            <div className="space-y-4">
                                {wallets.map((wallet) => (
                                    <div key={wallet.id} className="flex items-center p-5 border border-gray-200 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all duration-300">
                                        <div className={`h-12 w-12 rounded-full ${wallet.type === 'personal' ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                            } text-white flex items-center justify-center mr-5`}>
                                            {wallet.type === 'personal' ? <User size={20} /> : <Users size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="flex items-center">
                                                        <p className="font-semibold text-gray-800">
                                                            {wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Wallet
                                                        </p>
                                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${wallet.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {wallet.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Created on {formatDate(wallet.createdAt)}</p>
                                                </div>
                                                <div className="mt-2 md:mt-0 md:text-right">
                                                    <p className="text-xl font-bold text-gray-800">
                                                        {wallet.currency} {wallet.balance}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex mt-4 space-x-2 md:justify-end">
                                                <button
                                                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 flex items-center"
                                                    onClick={() => navigate(`/wallets/${wallet.id}`)}
                                                >
                                                    <Eye size={14} className="mr-1.5" />
                                                    Details
                                                </button>
                                                <button className="px-3 py-1.5 text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors duration-300 flex items-center">
                                                    <CreditCard size={14} className="mr-1.5" />
                                                    Transactions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-xl">
                                <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-2">No wallets found</p>
                                <p className="text-sm text-gray-500 mb-6">This user doesn't have any wallets yet</p>
                                <button className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center mx-auto">
                                    <CreditCard size={16} className="mr-2" />
                                    Create Wallet
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                        <SectionHeader title="Activity Log">
                            <div className="flex items-center space-x-2">
                                <select
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                                    defaultValue="all"
                                >
                                    <option value="all">All Activity</option>
                                    <option value="login">Login</option>
                                    <option value="wallet">Wallet</option>
                                    <option value="profile">Profile</option>
                                </select>
                                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 text-sm">
                                    Export
                                </button>
                            </div>
                        </SectionHeader>

                        {activities.length > 0 ? (
                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex">
                                        <div className="mr-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${activity.type === 'login' ? 'bg-primary-100 text-primary-600' :
                                                activity.type === 'wallet' ? 'bg-green-100 text-green-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                {activity.type === 'login' ? <LogOut size={20} /> :
                                                    activity.type === 'wallet' ? <CreditCard size={20} /> :
                                                        <User size={20} />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{activity.description}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            via {activity.device}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">{formatDate(activity.timestamp)}</p>
                                                        <p className="text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                                                    <span className="bg-gray-200 px-2 py-1 rounded-md mr-2">IP: {activity.ip}</span>
                                                    <span className="bg-gray-200 px-2 py-1 rounded-md">Type: {activity.type}</span>
                                                </div>
                                            </div>
                                            <div className="h-6 border-l-2 border-gray-200 ml-5"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-xl">
                                <Activity size={64} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-2">No activity found</p>
                                <p className="text-sm text-gray-500">User activity will appear here</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Security Settings" />
                                <div className="space-y-6">
                                    <div className="p-5 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                                    <Shield size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Account Status</p>
                                                    <p className="text-sm text-gray-500">Control user access to the platform</p>
                                                </div>
                                            </div>
                                            <div>
                                                <select
                                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                                                    defaultValue={user.account_status}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                                    <Activity size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Login Activity</p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.last_login
                                                            ? `Last login ${timeAgo(user.last_login)}`
                                                            : 'No login activity recorded'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300">
                                                View All
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 border border-red-100 rounded-xl hover:border-red-200 transition-colors duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                                                    <AlertCircle size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Danger Zone</p>
                                                    <p className="text-sm text-gray-500">Actions with permanent consequences</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Verification Status" />

                                <div className="space-y-6">
                                    <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl p-6">
                                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${user.verification_status === 'verified' ? 'bg-green-100 text-green-600' :
                                            user.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-gray-100 text-gray-600'
                                            } mb-4`}>
                                            {user.verification_status === 'verified' ? <CheckCircle size={32} /> :
                                                user.verification_status === 'pending' ? <Clock size={32} /> :
                                                    <AlertCircle size={32} />}
                                        </div>

                                        <p className="text-lg font-semibold text-gray-800">
                                            {user.verification_status === 'verified' ? 'Verified Account' :
                                                user.verification_status === 'pending' ? 'Verification Pending' :
                                                    'Not Verified'}
                                        </p>

                                        <p className="text-sm text-gray-600 text-center mt-2 mb-4">
                                            {user.verification_status === 'verified'
                                                ? 'All verification requirements have been met.'
                                                : user.verification_status === 'pending'
                                                    ? 'Verification documents are under review.'
                                                    : 'User has not completed verification process.'}
                                        </p>

                                        {user.verification_status !== 'verified' && (
                                            <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-300 text-sm font-medium w-full">
                                                {user.verification_status === 'pending'
                                                    ? 'Review Documents'
                                                    : 'Send Verification Request'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <Mail size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-600">Email Verification</span>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {user.is_verified ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                                                {user.is_verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <Phone size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-600">Phone Verification</span>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                <AlertCircle size={12} className="mr-1" />
                                                Not Verified
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <FileText size={16} className="text-gray-400 mr-3" />
                                                <span className="text-gray-600">ID Verification</span>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.kyc_status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {user.kyc_status ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                                                {user.kyc_status ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default userdetail;