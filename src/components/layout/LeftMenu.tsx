
import React, { useState, useRef, useEffect } from 'react';
import {
    Home,
    Settings,
    BarChart3,
    LogOut,
    UserCheck,
    Activity
} from 'lucide-react';

const user = {
    name: 'John Doe',
    role: 'Admin',
    avatar: null,
    email: 'john@example.com'
};

const SlimSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 z-50 ${isExpanded ? 'w-64' : 'w-20'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex flex-col h-full p-4">
                {/* User Profile */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="relative">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        </div>
                        {isExpanded && (
                            <div className="ml-3 animate-fadeIn">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.role}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <button className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                        <Home size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Home</span>}
                    </button>
                    <button className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                        <Activity size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Activity</span>}
                    </button>
                    <button className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                        <BarChart3 size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Analytics</span>}
                    </button>
                    <button className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                        <UserCheck size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Profile</span>}
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-4 border-t border-gray-700">
                    <button className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                        <Settings size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Settings</span>}
                    </button>
                    <button className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                        <LogOut size={20} />
                        {isExpanded && <span className="ml-3 text-sm animate-fadeIn">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlimSidebar;
