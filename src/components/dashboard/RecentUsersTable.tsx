import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import moment from 'moment';

interface RecentUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    createdAt: string;
    status: string;
}

interface RecentUsersTableProps {
    recentUsers: RecentUser[];
}

const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ recentUsers }) => {

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-scrollbar">
                <div className="min-w-full">
                    {recentUsers?.slice(0, 9)?.map((user, index) => (
                        <motion.div
                            key={user.id}
                            className="border-b border-gray-50 dark:border-dark-border last:border-0 hover:bg-gray-50/50 dark:hover:bg-dark-active/50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ x: 3 }}
                        >
                            <div className="flex items-center p-4">
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3 shrink-0">
                                    <User size={16} className="text-primary-600 dark:text-primary-400" strokeWidth={1.8} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-neutral-200 truncate">{user.first_name || 'N/A'} {user.last_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{user.email || 'No email provided'}</p>
                                </div>
                                <div className="flex items-center ml-3">
                                    <span className="text-xs text-gray-500 dark:text-neutral-500 mr-2 text-right whitespace-nowrap">
                                        {moment(user.createdAt).fromNow()}
                                    </span>
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
