import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    CalendarDays,
    Mail,
    Phone,
    MapPin,
    Shield,
    CreditCard,
    UserCheck,
    Activity,
    KeyRound,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    LogOut,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Smartphone,
    Globe,
    Server,
    Cpu,
    FileText,
    X,
    Edit
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import userService from '../../../api/services/users';
import StatusBadge from '../../../components/common/StatusBadge';
import DataTable from '../../../components/common/DataTable';
import TabNavigation from '../../../components/common/TabNavigation';
import EditAdmin from '../../../components/users/EditAdmin';
import { UserAdmin } from '../../../types/user';

const UserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserAdmin | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role_id: '',
        account_status: 'active'
    });

    const openEditModal = () => {
        if (!user) return;

        setEditFormData({
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone_number: user.phone_number || '',
            role_id: user.role?.id || '',
            account_status: user.status || 'active'
        });
        setIsEditModalOpen(true);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.updateUser(id, editFormData);
            toast.success('User updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update user:', error);
            toast.error('Failed to update user');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoadingUser(true);
            try {
                const userData = await userService.getAdminUserbyId(id);
                setUser({
                    ...userData,
                    name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                    lastActive: userData.last_login
                        ? formatDistanceToNow(new Date(userData.last_login), { addSuffix: true })
                        : 'Never'
                });
            } catch (error) {
                console.error('Failed to fetch user:', error);
                toast.error('Failed to load user details');
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'sessions' && user) {
            fetchUserSessions();
        } else if (activeTab === 'login-history' && user) {
            fetchLoginHistory();
        }
    }, [activeTab, user]);

    const fetchUserSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const sessions = await userService.getUserSessions(id);
            setActiveSessions(sessions);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            toast.error('Failed to load user sessions');
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const fetchLoginHistory = async () => {
        setIsLoadingLogs(true);
        try {
            const history = await userService.getUserLoginHistory(id);
            setLoginHistory(history);
        } catch (error) {
            console.error('Failed to fetch login history:', error);
            toast.error('Failed to load login history');
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const handleSendPasswordReset = async () => {
        try {
            setIsSendingReset(true);
            await userService.sendPasswordReset(id);
            setResetSent(true);
            toast.success('Password reset email sent successfully');

            setTimeout(() => {
                setResetSent(false);
            }, 10000);
        } catch (error) {
            console.error('Failed to send password reset:', error);
            toast.error('Failed to send password reset email');
        } finally {
            setIsSendingReset(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleTerminateSession = async (sessionId) => {
        try {
            await userService.terminateUserSession(id, sessionId);
            toast.success('Session terminated successfully');
            fetchUserSessions();
        } catch (error) {
            console.error('Failed to terminate session:', error);
            toast.error('Failed to terminate session');
        }
    };

    const handleTerminateAllSessions = async () => {
        try {
            await userService.terminateAllUserSessions(id);
            toast.success('All sessions terminated successfully');
            fetchUserSessions();
        } catch (error) {
            console.error('Failed to terminate all sessions:', error);
            toast.error('Failed to terminate sessions');
        }
    };

    const handleToggleUserStatus = async () => {
        if (!user) return;

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        try {
            await userService.updateUserStatus(id, newStatus);
            setUser({ ...user, status: newStatus });
            toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Failed to update user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const handleResetMFA = async () => {
        try {
            await userService.resetUserMFA(id);
            toast.success('MFA has been reset successfully');
            // Refresh user data
            const userData = await userService.getUserById(id);
            setUser({
                ...userData,
                name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                lastActive: userData.last_login
                    ? formatDistanceToNow(new Date(userData.last_login), { addSuffix: true })
                    : 'Never'
            });
        } catch (error) {
            console.error('Failed to reset MFA:', error);
            toast.error('Failed to reset MFA');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Eye size={16} /> },
        { id: 'sessions', label: 'Active Sessions', icon: <Globe size={16} /> },
        { id: 'login-history', label: 'Login History', icon: <Clock size={16} /> },
        { id: 'connected-apps', label: 'Connected Apps', icon: <Server size={16} /> },
        { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    ];

    const sessionColumns = [
        {
            id: 'device',
            header: 'Device',
            accessor: (row) => row.device_type,
            cell: (value, row) => (
                <div className="flex items-center">
                    <Smartphone size={16} className="mr-2 text-gray-400" />
                    <div>
                        <p className="font-medium">{value || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{row.browser || 'Unknown browser'}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'location',
            header: 'Location',
            accessor: (row) => row.location,
            cell: (value) => (
                <div className="flex items-center">
                    <Globe size={16} className="mr-2 text-gray-400" />
                    <span>{value || 'Unknown location'}</span>
                </div>
            )
        },
        {
            id: 'ip',
            header: 'IP Address',
            accessor: (row) => row.ip_address,
        },
        {
            id: 'started',
            header: 'Started',
            accessor: (row) => row.created_at,
            cell: (value) => (
                <span>{value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : 'Unknown'}</span>
            )
        },
        {
            id: 'last_active',
            header: 'Last Active',
            accessor: (row) => row.last_active,
            cell: (value) => (
                <span>{value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : 'Unknown'}</span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (row) => row.id,
            cell: (value) => (
                <motion.button
                    className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTerminateSession(value)}
                >
                    Terminate
                </motion.button>
            )
        }
    ];

    const loginHistoryColumns = [
        {
            id: 'timestamp',
            header: 'Time',
            accessor: (row) => row.timestamp,
            cell: (value) => (
                <div>
                    <p>{value ? format(new Date(value), 'MMM d, yyyy') : 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{value ? format(new Date(value), 'h:mm a') : ''}</p>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (row) => row.status,
            cell: (value) => (
                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${value === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                    }`}>
                    {value === 'success' ? 'Success' : 'Failed'}
                </span>
            )
        },
        {
            id: 'method',
            header: 'Method',
            accessor: (row) => row.method,
        },
        {
            id: 'location',
            header: 'Location',
            accessor: (row) => row.location,
        },
        {
            id: 'device',
            header: 'Device/Browser',
            accessor: (row) => row.device,
        },
        {
            id: 'ip',
            header: 'IP Address',
            accessor: (row) => row.ip_address,
        }
    ];

    const InfoCard = ({
        icon,
        label,
        value,
        className = ''
    }) => (
        <div className={`bg-gray-50 p-4 rounded-xl border border-gray-100 ${className}`}>
            <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                {icon}
                <span className="ml-2">{label}</span>
            </h4>
            <div className="text-gray-800 font-medium">{value}</div>
        </div>
    );

    const ActionButton = ({
        icon,
        label,
        onClick,
        isPrimary = false,
        isDanger = false,
        isDisabled = false
    }) => (
        <motion.button
            className={`flex items-center px-4 py-2.5 rounded-xl text-sm shadow-sm transition-all duration-200 ${isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isPrimary
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400'
                    : isDanger
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            whileHover={{ y: isDisabled ? 0 : -2, boxShadow: isDisabled ? 'none' : '0 8px 16px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ y: isDisabled ? 0 : 0, boxShadow: isDisabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            onClick={onClick}
            disabled={isDisabled}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </motion.button>
    );

    if (isLoadingUser) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading user details...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    User not found or you don't have permission to view this user.
                </div>
                <div className="mt-4">
                    <button
                        className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center">
                <motion.button
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 mr-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={20} />
                </motion.button>
                <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                    User Details
                </h1>
            </div>

            <div className="relative h-40 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-2xl p-6 flex items-end mb-14">
                <motion.div
                    initial={{ scale: 0.8, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="absolute -bottom-10 left-6 w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-white"
                >
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                </motion.div>

                <div className="absolute right-6 bottom-6 flex space-x-2">
                    <ActionButton
                        icon={<Edit size={16} />}
                        label="Edit Profile"
                        onClick={openEditModal}
                    />
                    <ActionButton
                        icon={user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                        label={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                        onClick={handleToggleUserStatus}
                        isDanger={user.status === 'active'}
                        isPrimary={user.status !== 'active'}
                    />
                    <ActionButton
                        icon={<LogOut size={16} />}
                        label="Terminate All Sessions"
                        onClick={handleTerminateAllSessions}
                        isDanger={true}
                    />
                </div>
            </div>

            <div className="px-6 pt-8 pb-4 bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0">
                <div className="flex justify-between items-start">
                    <div>
                        <motion.h2
                            className="text-xl font-semibold text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {user.name}
                        </motion.h2>
                        <motion.p
                            className="text-gray-500 flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Mail size={14} className="mr-2" />
                            {user.email}
                        </motion.p>
                    </div>

                    {/* Password Reset Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {resetSent ? (
                            <div className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                                <CheckCircle size={14} className="mr-1" />
                                <span>Reset email sent</span>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSendPasswordReset}
                                disabled={isSendingReset}
                                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium 
                                ${isSendingReset
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                                    }`}
                            >
                                {isSendingReset ? (
                                    <>
                                        <RefreshCw size={14} className="mr-2 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={14} className="mr-2" />
                                        <span>Send Password Reset</span>
                                    </>
                                )}
                            </motion.button>
                        )}
                    </motion.div>
                </div>

                {/* Status Badges */}
                <div className="flex mt-4 space-x-3">
                    <div className="flex items-center px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700">
                        <Shield size={14} className="mr-2 text-primary-500" />
                        <span>{user.role.title || 'No role assigned'}</span>
                    </div>

                    <StatusBadge status={user.status as any} size="lg" withIcon withDot={user.status === 'active'} />

                    <div className="flex items-center px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700">
                        <Cpu size={14} className="mr-2 text-primary-500" />
                        <span>{user.mfa_enabled ? 'MFA Enabled' : 'MFA Disabled'}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 mb-4">
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    variant="default"
                    className=""
                    scrollable={false}
                />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'overview' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <InfoCard
                                icon={<Shield size={14} className="text-primary-500" />}
                                label="ROLE"
                                value={user.role.title || 'No role assigned'}
                            />

                            <InfoCard
                                icon={<UserCheck size={14} className="text-primary-500" />}
                                label="STATUS"
                                value={<StatusBadge status={user.status as any} size="md" withIcon />}
                            />

                            <InfoCard
                                icon={<Cpu size={14} className="text-primary-500" />}
                                label="MFA STATUS"
                                value={
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${user.mfa_enabled
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {user.mfa_enabled ? 'Enabled' : 'Not Enabled'}
                                    </span>
                                }
                            />
                        </div>

                        {/* Contact information */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-4">
                            <h3 className="text-sm font-medium text-gray-800 mb-3">Contact Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <Mail size={14} className="text-gray-400 mr-2" />
                                    <span className="text-gray-700">{user.email}</span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <Phone size={14} className="text-gray-400 mr-2" />
                                    <span className="text-gray-700">{user.phone_number || 'Not provided'}</span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <MapPin size={14} className="text-gray-400 mr-2" />
                                    <span className="text-gray-700">{user.location || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InfoCard
                                icon={<Clock size={14} className="text-primary-500" />}
                                label="LAST ACTIVE"
                                value={
                                    <div className="text-sm flex items-center">
                                        {user.last_login ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true }) : 'Never'}
                                    </div>
                                }
                            />

                            <InfoCard
                                icon={<CalendarDays size={14} className="text-primary-500" />}
                                label="JOINED"
                                value={
                                    <div className="text-sm">
                                        {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}
                                    </div>
                                }
                            />
                        </div>

                        {/* Transactions */}
                        <InfoCard
                            icon={<CreditCard size={14} className="text-primary-500" />}
                            label="TRANSACTIONS"
                            value={
                                <div className="flex items-center">
                                    <span className="text-lg font-semibold mr-2">{user.transactions_count}</span>
                                    <div className="h-2.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(user.transactions_count * 2, 100)}%` }}
                                            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            }
                        />

                        {/* Activity timeline */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mt-4">
                            <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                <Activity size={14} className="text-primary-500 mr-2" />
                                Activity Timeline
                            </h3>
                            <div className="relative pl-4 border-l border-gray-200 space-y-3">
                                <div className="relative">
                                    <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                    <p className="text-xs font-medium text-gray-700">Account Created</p>
                                    <p className="text-xs text-gray-500">{user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}</p>
                                </div>

                                {user.last_login && (
                                    <div className="relative">
                                        <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                        <p className="text-xs font-medium text-gray-700">Last Login</p>
                                        <p className="text-xs text-gray-500">{format(new Date(user.last_login), 'MMM d, yyyy, h:mm a')}</p>
                                    </div>
                                )}

                                {user.transactions_count > 0 && (
                                    <div className="relative">
                                        <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        <p className="text-xs font-medium text-gray-700">Transactions</p>
                                        <p className="text-xs text-gray-500">{user.transactions_count} total transactions</p>
                                    </div>
                                )}

                                {resetSent && (
                                    <div className="relative">
                                        <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                        <p className="text-xs font-medium text-gray-700">Password Reset Email</p>
                                        <p className="text-xs text-gray-500">Sent {format(new Date(), 'MMM d, yyyy, h:mm a')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Active Sessions</h3>
                            <ActionButton
                                icon={<LogOut size={16} />}
                                label="Terminate All Sessions"
                                onClick={handleTerminateAllSessions}
                                isDanger={true}
                            />
                        </div>

                        <DataTable
                            columns={sessionColumns}
                            data={activeSessions}
                            isLoading={isLoadingSessions}
                            emptyMessage="No active sessions found for this user."
                        />

                        <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm">
                            <AlertCircle size={16} className="inline-block mr-2" />
                            Terminating a session will immediately log the user out of that device.
                        </div>
                    </div>
                )}

                {activeTab === 'login-history' && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Login History</h3>
                        <DataTable
                            columns={loginHistoryColumns}
                            data={loginHistory}
                            isLoading={isLoadingLogs}
                            emptyMessage="No login history found for this user."
                        />
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Security Settings</h3>

                        {/* Password Management */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                            <h4 className="text-md font-medium mb-2">Password Management</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Manage the user's password and send password reset links.
                            </p>

                            <div className="flex space-x-2">
                                <ActionButton
                                    icon={<KeyRound size={16} />}
                                    label="Send Password Reset"
                                    onClick={handleSendPasswordReset}
                                    isDisabled={isSendingReset || resetSent}
                                />

                                {user.status === 'active' && (
                                    <ActionButton
                                        icon={<Eye size={16} />}
                                        label="Force Password Change"
                                        onClick={() => {
                                            toast("This feature is coming soon");
                                        }}
                                    />
                                )}
                            </div>

                            {resetSent && (
                                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                                    <CheckCircle size={16} className="inline-block mr-2" />
                                    Password reset email sent successfully. The link will expire in 24 hours.
                                </div>
                            )}
                        </div>

                        {/* Multi-Factor Authentication */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                            <h4 className="text-md font-medium mb-2">Multi-Factor Authentication</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                {user.mfa_enabled
                                    ? "The user has enabled MFA for their account."
                                    : "The user has not enabled MFA for their account."
                                }
                            </p>

                            <div className="flex space-x-2">
                                {user.mfa_enabled ? (
                                    <ActionButton
                                        icon={<EyeOff size={16} />}
                                        label="Reset MFA"
                                        onClick={handleResetMFA}
                                        isDanger={true}
                                    />
                                ) : (
                                    <ActionButton
                                        icon={<Eye size={16} />}
                                        label="Require MFA Setup"
                                        onClick={() => {
                                            toast("This feature is coming soon");
                                        }}
                                    />
                                )}
                            </div>

                            <div className="mt-4 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm">
                                <AlertCircle size={16} className="inline-block mr-2" />
                                Resetting MFA will remove all enrolled devices and require the user to set up MFA again.
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <h4 className="text-md font-medium mb-2">Account Status</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Control the user's access to the platform.
                            </p>

                            <div className="flex space-x-2">
                                <ActionButton
                                    icon={user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                                    label={user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                                    onClick={handleToggleUserStatus}
                                    isDanger={user.status === 'active'}
                                    isPrimary={user.status !== 'active'}
                                />

                                <ActionButton
                                    icon={<FileText size={16} />}
                                    label="View Audit Logs"
                                    onClick={() => {
                                        toast("This feature is coming soon");
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Edit User Modal */}
            {isEditModalOpen && (
                <EditAdmin
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleEditSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default UserDetailsPage;