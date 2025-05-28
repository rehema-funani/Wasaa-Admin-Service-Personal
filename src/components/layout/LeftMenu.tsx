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
            className={`flex flex-col h-full bg-gradient-to-b from-primary-900 to-primary-800 transition-all duration-300 z-50 shadow-xl ${isExpanded ? 'w-64' : 'w-[65px]'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className={`flex flex-col h-full p-4 space-y-4 ${isExpanded ? 'px-6' : 'px-2'}`}>
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="relative">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium shadow-lg">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary-800"></div>
                        </div>
                        {isExpanded && (
                            <div className="ml-3 animate-fadeIn">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-primary-300">{user.role}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <Link to='/' className="w-full flex items-center p-3 rounded-xl text-primary-200 hover:text-white hover:bg-primary-700/50 transition-all duration-200 group active:bg-primary-600">
                        <Home size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Home</span>}
                    </Link>
                    <Link to='/admin/logs' className="w-full flex items-center p-3 rounded-xl text-primary-200 hover:text-white hover:bg-primary-700/50 transition-all duration-200 group active:bg-primary-600">
                        <Activity size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Activity</span>}
                    </Link>
                    <Link to='/admin/finance/reports' className="w-full flex items-center p-3 rounded-xl text-primary-200 hover:text-white hover:bg-primary-700/50 transition-all duration-200 group active:bg-primary-600">
                        <BarChart3 size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Analytics</span>}
                    </Link>
                    <Link to='/accounts/profile' className="w-full flex items-center p-3 rounded-xl text-primary-200 hover:text-white hover:bg-primary-700/50 transition-all duration-200 group active:bg-primary-600">
                        <UserCheck size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Profile</span>}
                    </Link>
                </div>

                <div className="space-y-2 pt-4 border-t border-primary-700">
                    <Link to='/admin/settings' className="w-full flex items-center p-3 rounded-xl text-primary-200 hover:text-white hover:bg-primary-700/50 transition-all duration-200 group active:bg-primary-600">
                        <Settings size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Settings</span>}
                    </Link>
                    <button className="w-full flex items-center p-3 rounded-xl text-red-300 hover:text-white hover:bg-red-600/50 transition-all duration-200 group active:bg-red-500">
                        <LogOut size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlimSidebar;