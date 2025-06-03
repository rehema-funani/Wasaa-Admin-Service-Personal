// UserMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Bell,
    User,
    Settings,
    LogOut,
    CreditCard,
    AlertCircle,
    Shield,
    ChevronDown
} from 'lucide-react';

interface Notification {
    id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: 'transaction' | 'alert' | 'system' | string;
}

interface UserMenuProps {
    user: any;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
    // State
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(3);

    // Refs
    const notificationsRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Sample notifications data
    const notifications: Notification[] = [
        {
            id: 1,
            title: 'New transaction',
            description: 'Payment of $5,000 received',
            time: '2m ago',
            read: false,
            type: 'transaction'
        },
        {
            id: 2,
            title: 'Risk alert',
            description: 'Unusual activity detected on wallet #4829',
            time: '1h ago',
            read: false,
            type: 'alert'
        },
        {
            id: 3,
            title: 'System update',
            description: 'System maintenance completed successfully',
            time: '3h ago',
            read: false,
            type: 'system'
        },
    ];

    // Effects
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }

            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handlers
    const markAllAsRead = () => {
        setUnreadNotifications(0);
    };

    // Helper functions
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'transaction':
                return (
                    <div className="p-2 rounded-full bg-emerald-50 border border-emerald-100">
                        <CreditCard size={16} className="text-emerald-500" />
                    </div>
                );
            case 'alert':
                return (
                    <div className="p-2 rounded-full bg-amber-50 border border-amber-100">
                        <AlertCircle size={16} className="text-amber-500" />
                    </div>
                );
            case 'system':
                return (
                    <div className="p-2 rounded-full bg-primary-50 border border-primary-100">
                        <Shield size={16} className="text-primary-500" />
                    </div>
                );
            default:
                return (
                    <div className="p-2 rounded-full bg-secondary-50 border border-secondary-100">
                        <Bell size={16} className="text-secondary-500" />
                    </div>
                );
        }
    };

    return (
        <>
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
                <button
                    className="p-2.5 rounded-xl hover:bg-secondary-600/40 dark:hover:bg-dark-hover transition-all duration-300 transform hover:scale-110 group text-gray-800/70 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white relative"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                    <Bell size={18} className="transition-colors duration-300" />
                    {unreadNotifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 dark:bg-rose-600 rounded-full shadow-lg shadow-rose-500/50 dark:shadow-rose-600/50 animate-pulse"></span>
                    )}
                </button>

                {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md rounded-2xl border border-secondary-100/30 dark:border-dark-border shadow-xl dark:shadow-dark-md z-50 overflow-hidden animate-fadeIn">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
                            <h3 className="font-medium text-gray-800 dark:text-neutral-200">Notifications</h3>
                            {unreadNotifications > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`
                    px-4 py-3 hover:bg-secondary-50/50 dark:hover:bg-dark-hover cursor-pointer relative
                    ${!notification.read ? 'bg-secondary-50/30 dark:bg-dark-active/30' : ''}
                  `}
                                >
                                    <div className="flex items-start">
                                        <div className="mt-0.5 mr-3">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">{notification.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{notification.description}</p>
                                            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{notification.time}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="absolute top-3 right-3 w-2 h-2 bg-secondary-500 dark:bg-secondary-400 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-4 py-2 border-t border-gray-100 dark:border-dark-border">
                            <button className="w-full text-xs text-center text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium py-1">
                                View all notifications
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Menu */}
            <div className="relative ml-2" ref={userMenuRef}>
                <button
                    className="flex items-center space-x-2 py-1.5 px-2 rounded-xl transition-all hover:bg-secondary-600/40 dark:hover:bg-dark-hover text-gray-800/90 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white group"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                    <div className="w-8 h-8 rounded-xl bg-secondary-600/60 dark:bg-secondary-700/40 backdrop-blur-sm flex items-center justify-center border border-secondary-500/30 dark:border-secondary-600/30 group-hover:bg-secondary-500/80 dark:group-hover:bg-secondary-600/60 transition-colors duration-300">
                        <User size={16} className="text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className="hidden md:block text-secondary-300 dark:text-neutral-500 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300" />
                </button>

                {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md rounded-2xl border border-secondary-100/30 dark:border-dark-border shadow-xl dark:shadow-dark-md z-50 overflow-hidden animate-fadeIn">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                            <p className="font-medium text-gray-800 dark:text-neutral-200">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">{user?.email}</p>
                            <div className="mt-1.5 flex items-center">
                                <span className="text-[10px] font-medium px-2 py-0.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full">
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        <div className="px-1 py-1">
                            <NavLink
                                to="/profile"
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300"
                            >
                                <User size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                <span>My Profile</span>
                            </NavLink>
                            <NavLink
                                to="/settings"
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300"
                            >
                                <Settings size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                <span>Settings</span>
                            </NavLink>
                        </div>

                        <div className="border-t border-gray-100 dark:border-dark-border mt-1 px-1 py-1">
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-900/20 text-sm flex items-center text-red-600 dark:text-red-400"
                            >
                                <LogOut size={16} className="mr-3" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserMenu;