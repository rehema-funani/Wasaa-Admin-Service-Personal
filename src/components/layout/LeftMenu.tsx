import React, { useState } from 'react';
import {
    Home,
    Settings,
    BarChart3,
    LogOut,
    UserCheck,
    Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const SlimSidebar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const user = Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null;

    return (
        <div
            className={`flex flex-col h-full bg-gradient-to-b from-primary-900 to-primary-800 dark:from-charcoal-950 dark:to-dark-surface transition-all duration-300 z-50 shadow-xl dark:shadow-dark-lg ${isExpanded ? 'w-64' : 'w-[65px]'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className={`flex flex-col h-full p-4 space-y-4 ${isExpanded ? 'px-6' : 'px-2'}`}>
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center text-white font-medium shadow-lg dark:shadow-dark-lg">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full border-2 border-primary-800 dark:border-dark-surface"></div>
                        </div>
                        {isExpanded && (
                            <div className="ml-3 animate-fadeIn">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-primary-300 dark:text-primary-400">{user?.role}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <Link to='/' className="w-full flex items-center p-3 rounded-xl text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover transition-all duration-200 group active:bg-primary-600 dark:active:bg-dark-active">
                        <Home size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Home</span>}
                    </Link>
                    <Link to='/admin/logs' className="w-full flex items-center p-3 rounded-xl text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover transition-all duration-200 group active:bg-primary-600 dark:active:bg-dark-active">
                        <Activity size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Activity</span>}
                    </Link>
                    <Link to='/admin/finance/reports' className="w-full flex items-center p-3 rounded-xl text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover transition-all duration-200 group active:bg-primary-600 dark:active:bg-dark-active">
                        <BarChart3 size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Analytics</span>}
                    </Link>
                    <Link to='/accounts/profile' className="w-full flex items-center p-3 rounded-xl text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover transition-all duration-200 group active:bg-primary-600 dark:active:bg-dark-active">
                        <UserCheck size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Profile</span>}
                    </Link>
                </div>

                <div className="space-y-2 pt-4 border-t border-primary-700 dark:border-dark-border">
                    <Link to='/admin/settings' className="w-full flex items-center p-3 rounded-xl text-primary-200 dark:text-primary-300 hover:text-white hover:bg-primary-700/50 dark:hover:bg-dark-hover transition-all duration-200 group active:bg-primary-600 dark:active:bg-dark-active">
                        <Settings size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Settings</span>}
                    </Link>
                    <button className="w-full flex items-center p-3 rounded-xl text-red-300 dark:text-red-400 hover:text-white hover:bg-red-600/50 dark:hover:bg-red-900/50 transition-all duration-200 group active:bg-red-500 dark:active:bg-red-900">
                        <LogOut size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Logout</span>}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SlimSidebar;