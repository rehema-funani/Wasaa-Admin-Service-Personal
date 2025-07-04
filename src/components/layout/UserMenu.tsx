import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    User,
    Settings,
    LogOut,
    ChevronDown
} from 'lucide-react';

interface UserMenuProps {
    user: any;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
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
                                to="/accounts/profile"
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300"
                            >
                                <User size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                <span>My Profile</span>
                            </NavLink>
                            <NavLink
                                to="/admin/settings"
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
