import React from 'react';
import { motion } from 'framer-motion';
import { User, MoreHorizontal } from 'lucide-react';
import moment from 'moment';

const RecentUsersTable = ({ recentUsers = [] }) => {
  // Create a set of gradient backgrounds for variety
  const gradients = [
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600'
  ];

  // User initials function
  const getInitials = (firstName, lastName) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-scrollbar">
        <div className="min-w-full">
          {(!recentUsers || recentUsers.length === 0) ? (
            // Empty state
            <div className="flex items-center justify-center py-6">
              <p className="text-sm text-gray-500">No recent users available</p>
            </div>
          ) : (
            // User list
            recentUsers.slice(0, 9).map((user, index) => (
              <motion.div
                key={user.id || index}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  backgroundColor: 'rgba(249, 250, 251, 0.9)',
                  x: 2,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center p-4">
                  {/* User Avatar */}
                  <div className={`w-10 h-10 rounded-xl ${gradients[index % gradients.length]} flex items-center justify-center mr-3 shrink-0 shadow-sm`}>
                    <span className="text-white text-sm font-medium">
                      {getInitials(user.first_name, user.last_name)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.first_name || 'N/A'} {user.last_name || ''}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || 'No email provided'}
                    </p>
                  </div>

                  {/* Timestamp and Actions */}
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-3 whitespace-nowrap">
                      {user.createdAt ? moment(user.createdAt).fromNow() : 'N/A'}
                    </span>
                    <motion.button
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
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
