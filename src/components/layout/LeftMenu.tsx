import React, { useState, useEffect } from 'react';
import {
    Home,
    Settings,
    BarChart3,
    LogOut,
    UserCheck,
    Activity,
    Shield,
    Clock,
    AlertTriangle,
    Bell,
    Lock,
    Database,
    DollarSign,
    Wallet,
    CreditCard,
    BriefcaseBusiness,
    FileText,
    Globe
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const SlimSidebar = () => {
    // State management
    const [isExpanded, setIsExpanded] = useState(false);
    const [systemStatus, setSystemStatus] = useState('operational');
    const [pendingApprovals, setPendingApprovals] = useState(5);
    const [riskAlerts, setRiskAlerts] = useState(3);
    const [userSecurityLevel, setUserSecurityLevel] = useState('level-3');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Get location and user data
    const location = useLocation();
    const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;

    // Update clock every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Check if a path is active
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    // Get status color based on system status
    const getStatusColor = (status) => {
        switch (status) {
            case 'operational':
                return 'bg-emerald-500 dark:bg-emerald-400';
            case 'degraded':
                return 'bg-amber-500 dark:bg-amber-400';
            case 'critical':
                return 'bg-red-500 dark:bg-red-400';
            default:
                return 'bg-gray-500 dark:bg-gray-400';
        }
    };

    // Format time for display
    const formatTime = () => {
        return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get security level information
    const getSecurityLevelIndicator = (level) => {
        switch (level) {
            case 'level-1':
                return { color: 'bg-gray-400 dark:bg-gray-500', label: 'Basic' };
            case 'level-2':
                return { color: 'bg-blue-500 dark:bg-blue-600', label: 'Standard' };
            case 'level-3':
                return { color: 'bg-violet-500 dark:bg-violet-600', label: 'Enhanced' };
            case 'level-4':
                return { color: 'bg-amber-500 dark:bg-amber-600', label: 'Advanced' };
            case 'level-5':
                return { color: 'bg-red-500 dark:bg-red-600', label: 'Critical' };
            default:
                return { color: 'bg-gray-400 dark:bg-gray-500', label: 'Unknown' };
        }
    };

    const securityLevel = getSecurityLevelIndicator(userSecurityLevel);

    // Navigation metadata with badges and enhanced icons
    const navItems = [
        {
            path: '/',
            title: 'Dashboard',
            icon: Home,
            badge: null,
            category: 'main'
        },
        {
            path: '/admin/logs',
            title: 'Activity',
            icon: Activity,
            badge: riskAlerts > 0 ? { count: riskAlerts, type: 'warning' } : null,
            category: 'main'
        },
        {
            path: '/admin/finance/reports',
            title: 'Analytics',
            icon: BarChart3,
            badge: null,
            category: 'main'
        },
        {
            path: '/accounts/profile',
            title: 'Profile',
            icon: UserCheck,
            badge: null,
            category: 'account'
        },
        {
            path: '/admin/settings',
            title: 'Settings',
            icon: Settings,
            badge: null,
            category: 'account'
        }
    ];

    // Get badge style based on type
    const getBadgeStyle = (type) => {
        switch (type) {
            case 'danger':
                return 'bg-red-500 text-white dark:bg-red-600';
            case 'warning':
                return 'bg-amber-500 text-white dark:bg-amber-600';
            case 'info':
                return 'bg-blue-500 text-white dark:bg-blue-600';
            case 'success':
                return 'bg-emerald-500 text-white dark:bg-emerald-600';
            default:
                return 'bg-gray-500 text-white dark:bg-gray-600';
        }
    };

    return (
        <div
            className={`flex flex-col h-full bg-gradient-to-b from-slate-900 to-primary-900 dark:from-charcoal-950 dark:to-dark-surface transition-all duration-300 z-50 shadow-xl dark:shadow-dark-lg ${isExpanded ? 'w-64' : 'w-[65px]'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className={`flex flex-col h-full p-4 space-y-3 ${isExpanded ? 'px-5' : 'px-2'}`}>
                {/* User Profile Section - Enhanced */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-600 dark:from-indigo-600 dark:to-primary-800 flex items-center justify-center text-white font-medium shadow-lg dark:shadow-dark-lg">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full border-2 border-slate-800 dark:border-dark-surface"></div>
                        </div>
                        {isExpanded && (
                            <div className="ml-3 animate-fadeIn">
                                <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                                <div className="flex items-center">
                                    <span className={`w-1.5 h-1.5 rounded-full ${securityLevel.color} mr-1.5`}></span>
                                    <p className="text-xs text-slate-300 dark:text-slate-400">{securityLevel.label} Access</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Status - Only visible when expanded */}
                {isExpanded && (
                    <div className="bg-slate-800/60 dark:bg-dark-elevated/60 rounded-lg p-2.5 flex justify-between items-center mb-1">
                        <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus)} ${systemStatus !== 'operational' ? 'animate-pulse' : ''} mr-2`}></div>
                            <span className="text-xs text-slate-300 dark:text-slate-400">System Status</span>
                        </div>
                        <span className="text-xs font-medium text-slate-200 dark:text-slate-300 capitalize">{systemStatus}</span>
                    </div>
                )}

                {/* Time Display - Only visible when expanded */}
                {isExpanded && (
                    <div className="bg-slate-800/60 dark:bg-dark-elevated/60 rounded-lg p-2.5 flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <Clock size={14} className="text-slate-400 dark:text-slate-500 mr-2" />
                            <span className="text-xs text-slate-300 dark:text-slate-400">EAT Time</span>
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-200 dark:text-slate-300">{formatTime()}</span>
                    </div>
                )}

                {/* Pending Approvals Indicator - Only visible when expanded */}
                {isExpanded && pendingApprovals > 0 && (
                    <div className="bg-amber-900/20 dark:bg-amber-900/30 border border-amber-800/30 rounded-lg p-2.5 flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <Bell size={14} className="text-amber-500 dark:text-amber-400 mr-2" />
                            <span className="text-xs text-amber-300 dark:text-amber-300">Pending Approvals</span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-amber-500 dark:bg-amber-600 text-white rounded-full text-[10px] font-medium">{pendingApprovals}</span>
                    </div>
                )}

                {/* Main Navigation */}
                <div className="flex-1 space-y-1 py-1">
                    {/* Main Navigation Group */}
                    {isExpanded && (
                        <div className="mb-2">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600 font-medium px-2 mb-1.5">
                                Main Navigation
                            </p>
                        </div>
                    )}

                    {/* Dashboard Link - Enhanced */}
                    <Link
                        to="/"
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive('/')
                            ? 'bg-indigo-600/20 text-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover'
                            }`}
                    >
                        <div className={`${isActive('/') ? 'text-indigo-300 dark:text-indigo-400' : ''}`}>
                            <DollarSign size={20} strokeWidth={isActive('/') ? 2 : 1.5} />
                        </div>
                        {isExpanded && (
                            <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                                <span className={`text-sm ${isActive('/') ? 'font-medium' : ''}`}>Dashboard</span>
                                {isActive('/') && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                                )}
                            </div>
                        )}
                    </Link>

                    {/* Activity Link - Enhanced with financial icons and badges */}
                    <Link
                        to="/admin/logs"
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive('/admin/logs')
                            ? 'bg-indigo-600/20 text-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover'
                            }`}
                    >
                        <div className={`relative ${isActive('/admin/logs') ? 'text-indigo-300 dark:text-indigo-400' : ''}`}>
                            <Shield size={20} strokeWidth={isActive('/admin/logs') ? 2 : 1.5} />
                            {riskAlerts > 0 && !isExpanded && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 dark:bg-amber-600 rounded-full text-[10px] font-medium flex items-center justify-center text-white">
                                    {riskAlerts}
                                </span>
                            )}
                        </div>
                        {isExpanded && (
                            <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                                <span className={`text-sm ${isActive('/admin/logs') ? 'font-medium' : ''}`}>Activity</span>
                                {riskAlerts > 0 && (
                                    <span className="px-1.5 py-0.5 bg-amber-500 dark:bg-amber-600 text-white rounded-full text-[10px] font-medium">
                                        {riskAlerts}
                                    </span>
                                )}
                                {isActive('/admin/logs') && !riskAlerts && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                                )}
                            </div>
                        )}
                    </Link>

                    {/* Analytics Link - Enhanced */}
                    <Link
                        to="/admin/finance/reports"
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive('/admin/finance/reports')
                            ? 'bg-indigo-600/20 text-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover'
                            }`}
                    >
                        <div className={`${isActive('/admin/finance/reports') ? 'text-indigo-300 dark:text-indigo-400' : ''}`}>
                            <BarChart3 size={20} strokeWidth={isActive('/admin/finance/reports') ? 2 : 1.5} />
                        </div>
                        {isExpanded && (
                            <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                                <span className={`text-sm ${isActive('/admin/finance/reports') ? 'font-medium' : ''}`}>Analytics</span>
                                {isActive('/admin/finance/reports') && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                                )}
                            </div>
                        )}
                    </Link>

                    {/* Account Section Divider */}
                    {isExpanded && (
                        <div className="pt-4 pb-2 mt-3">
                            <div className="flex items-center">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600 font-medium px-2">
                                    Account
                                </p>
                                <div className="flex-1 h-px bg-slate-700/50 dark:bg-dark-border/50 ml-2"></div>
                            </div>
                        </div>
                    )}

                    {!isExpanded && (
                        <div className="my-3 h-px bg-slate-700/50 dark:bg-dark-border/50"></div>
                    )}

                    {/* Profile Link */}
                    <Link
                        to="/accounts/profile"
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive('/accounts/profile')
                            ? 'bg-indigo-600/20 text-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover'
                            }`}
                    >
                        <div className={`${isActive('/accounts/profile') ? 'text-indigo-300 dark:text-indigo-400' : ''}`}>
                            <UserCheck size={20} strokeWidth={isActive('/accounts/profile') ? 2 : 1.5} />
                        </div>
                        {isExpanded && (
                            <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                                <span className={`text-sm ${isActive('/accounts/profile') ? 'font-medium' : ''}`}>Profile</span>
                                {isActive('/accounts/profile') && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                                )}
                            </div>
                        )}
                    </Link>

                    {/* Settings Link */}
                    <Link
                        to="/admin/settings"
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive('/admin/settings')
                            ? 'bg-indigo-600/20 text-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover'
                            }`}
                    >
                        <div className={`${isActive('/admin/settings') ? 'text-indigo-300 dark:text-indigo-400' : ''}`}>
                            <Settings size={20} strokeWidth={isActive('/admin/settings') ? 2 : 1.5} />
                        </div>
                        {isExpanded && (
                            <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                                <span className={`text-sm ${isActive('/admin/settings') ? 'font-medium' : ''}`}>Settings</span>
                                {isActive('/admin/settings') && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                                )}
                            </div>
                        )}
                    </Link>
                </div>

                {/* Security Zone Section - Only visible when expanded */}
                {isExpanded && (
                    <div className="mb-3 p-3 rounded-lg bg-slate-800/60 dark:bg-dark-elevated/60 border border-slate-700/50 dark:border-dark-border/50">
                        <div className="flex items-center">
                            <Lock size={14} className="text-slate-400 dark:text-slate-500 mr-2" />
                            <span className="text-xs font-medium text-slate-300 dark:text-slate-400">Security Zone</span>
                        </div>
                        <div className="mt-2 bg-slate-700/50 dark:bg-dark-active/50 rounded-md p-2 text-[11px] text-slate-300 dark:text-slate-400">
                            <p>Last login: <span className="text-slate-200 dark:text-slate-300">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                            <p className="mt-1">From: <span className="text-slate-200 dark:text-slate-300">Nairobi, KE</span></p>
                        </div>
                    </div>
                )}

                {/* Logout Button */}
                <div className="mt-auto pt-3 border-t border-slate-700/50 dark:border-dark-border/50">
                    <button
                        className="w-full flex items-center p-3 rounded-xl text-red-300 dark:text-red-400 hover:text-white hover:bg-red-600/30 dark:hover:bg-red-900/30 transition-all duration-200 group"
                    >
                        <LogOut size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Logout</span>}
                    </button>
                </div>

                {/* System Version - Only visible when expanded */}
                {isExpanded && (
                    <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <Database size={12} className="text-slate-500 dark:text-slate-600 mr-1.5" />
                            <span className="text-[10px] text-slate-500 dark:text-slate-600">v2.4.5</span>
                        </div>
                        <div className="flex items-center">
                            <Shield size={12} className="text-slate-500 dark:text-slate-600 mr-1.5" />
                            <span className="text-[10px] text-slate-500 dark:text-slate-600">PCI DSS</span>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default SlimSidebar;
