import React from 'react';
import { motion } from 'framer-motion';
import { User, MoreHorizontal } from 'lucide-react';

const RecentUsersTable: React.FC = () => {
    const recentUsers = [
        {
            id: 1,
            name: 'Emma Johnson',
            email: 'emma.j@example.com',
            joinedAt: '2 mins ago',
            status: 'active'
        },
        {
            id: 2,
            name: 'Alex Rivera',
            email: 'alex.r@example.com',
            joinedAt: '10 mins ago',
            status: 'active'
        },
        {
            id: 3,
            name: 'Sarah Chen',
            email: 'sarah.c@example.com',
            joinedAt: '25 mins ago',
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Michael Patel',
            email: 'm.patel@example.com',
            joinedAt: '42 mins ago',
            status: 'active'
        },
        {
            id: 5,
            name: 'Olivia Smith',
            email: 'o.smith@example.com',
            joinedAt: '1 hour ago',
            status: 'active'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-scrollbar">
                <div className="min-w-full">
                    {recentUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ x: 3 }}
                        >
                            <div className="flex items-center p-4">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 shrink-0">
                                    <User size={16} className="text-primary-600" strokeWidth={1.8} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <div className="flex items-center ml-3">
                                    <span className="text-xs text-gray-500 mr-2 text-right whitespace-nowrap">
                                        {user.joinedAt}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                                    <motion.button
                                        className="p-1.5 ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <MoreHorizontal size={14} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default RecentUsersTable;