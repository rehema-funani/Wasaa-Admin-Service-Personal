import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Clock, Activity } from 'lucide-react';

const ActiveEntitiesList = ({ type }) => {
  // Active users data
  const activeUsers = [
    {
      id: 1,
      name: 'David Wilson',
      subtitle: 'david.w@example.com',
      activity: 'Viewing dashboard',
      time: '2 mins'
    },
    {
      id: 2,
      name: 'Jessica Lee',
      subtitle: 'jessica.l@example.com',
      activity: 'Updating profile',
      time: '5 mins'
    },
    {
      id: 3,
      name: 'Robert Chen',
      subtitle: 'robert.c@example.com',
      activity: 'Creating a transaction',
      time: '8 mins'
    },
    {
      id: 4,
      name: 'Sophia Rodriguez',
      subtitle: 'sophia.r@example.com',
      activity: 'Viewing analytics',
      time: '12 mins'
    },
    {
      id: 5,
      name: 'James Taylor',
      subtitle: 'james.t@example.com',
      activity: 'Messaging',
      time: '15 mins'
    }
  ];

  // Active groups data
  const activeGroups = [
    {
      id: 1,
      name: 'Engineering Team',
      subtitle: '15 members',
      activity: 'Team discussion',
      time: '1 min'
    },
    {
      id: 2,
      name: 'Project Alpha',
      subtitle: '8 members',
      activity: 'File sharing',
      time: '7 mins'
    },
    {
      id: 3,
      name: 'Executive Board',
      subtitle: '5 members',
      activity: 'Decision making',
      time: '11 mins'
    },
    {
      id: 4,
      name: 'Sales Department',
      subtitle: '12 members',
      activity: 'Strategy planning',
      time: '18 mins'
    },
    {
      id: 5,
      name: 'Customer Success',
      subtitle: '9 members',
      activity: 'Client review',
      time: '25 mins'
    }
  ];

  // Select appropriate data based on type
  const data = type === 'users' ? activeUsers : activeGroups;

  // Modern fintech-inspired gradient backgrounds for avatars
  const getGradientBackground = (id) => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-emerald-500 to-teal-600',
      'bg-gradient-to-br from-violet-500 to-purple-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-rose-500 to-pink-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600'
    ];
    return gradients[id % gradients.length];
  };

  // Get initials for user/group avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get activity badge color based on time
  const getActivityBadgeColor = (time) => {
    const minutes = parseInt(time.split(' ')[0]);
    if (minutes < 5) return 'bg-emerald-100 text-emerald-700';
    if (minutes < 15) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-scrollbar">
        <div className="min-w-full">
          {data.map((entity, index) => (
            <motion.div
              key={entity.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{
                x: 2,
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center p-4">
                {/* Entity Avatar */}
                <div className={`w-10 h-10 rounded-xl ${getGradientBackground(entity.id)} flex items-center justify-center mr-3 shrink-0 shadow-sm`}>
                  <span className="text-white text-sm font-medium">
                    {getInitials(entity.name)}
                  </span>
                </div>

                {/* Entity Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {entity.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {entity.subtitle}
                  </p>
                </div>

                {/* Activity & Time */}
                <div className="ml-3 text-right">
                  <div className={`px-2 py-1 rounded-full text-xs ${getActivityBadgeColor(entity.time)} inline-block mb-1`}>
                    {entity.activity}
                  </div>
                  <div className="flex items-center justify-end">
                    <Clock size={12} className="text-emerald-500 mr-1" strokeWidth={2} />
                    <p className="text-xs text-emerald-600 font-medium">{entity.time}</p>
                  </div>
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

export default ActiveEntitiesList;
