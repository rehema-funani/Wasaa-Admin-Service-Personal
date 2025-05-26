import React from 'react';
import { motion } from 'framer-motion';
import { Users, MoreHorizontal } from 'lucide-react';

const RecentGroupsTable: React.FC = () => {
    const recentGroups = [
        {
            id: 1,
            name: 'Design Team',
            memberCount: 8,
            createdAt: '15 mins ago',
            status: 'active'
        },
        {
            id: 2,
            name: 'Finance Department',
            memberCount: 12,
            createdAt: '32 mins ago',
            status: 'active'
        },
        {
            id: 3,
            name: 'Marketing Team',
            memberCount: 6,
            createdAt: '1 hour ago',
            status: 'active'
        },
        {
            id: 4,
            name: 'Product Development',
            memberCount: 15,
            createdAt: '3 hours ago',
            status: 'inactive'
        },
        {
            id: 5,
            name: 'Customer Support',
            memberCount: 9,
            createdAt: '5 hours ago',
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

    const getGroupIconColor = (id: number) => {
        const colors = [
            'bg-primary-100 text-primary-600',
            'bg-primary-100 text-primary-600',
            'bg-emerald-100 text-emerald-600',
            'bg-amber-100 text-amber-600',
            'bg-violet-100 text-violet-600'
        ];
        return colors[id % colors.length];
    };

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-scrollbar">
                <div className="min-w-full">
                    {recentGroups.map((group, index) => (
                        <motion.div
                            key={group.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ x: 3 }}
                        >
                            <div className="flex items-center p-4">
                                <div className={`w-8 h-8 rounded-full ${getGroupIconColor(group.id)} flex items-center justify-center mr-3 shrink-0`}>
                                    <Users size={16} strokeWidth={1.8} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{group.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{group.memberCount} members</p>
                                </div>
                                <div className="flex items-center ml-3">
                                    <span className="text-xs text-gray-500 mr-2 text-right whitespace-nowrap">
                                        {group.createdAt}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(group.status)}`}></div>
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

export default RecentGroupsTable;