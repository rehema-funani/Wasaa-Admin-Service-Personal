import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Clock } from 'lucide-react';

interface ActiveEntitiesListProps {
    type: 'users' | 'groups';
}

const ActiveEntitiesList: React.FC<ActiveEntitiesListProps> = ({ type }) => {
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

    const data = type === 'users' ? activeUsers : activeGroups;
    const Icon = type === 'users' ? User : Users;

    const getRandomColor = (id: number) => {
        const colors = [
            'bg-indigo-100 text-indigo-600',
            'bg-blue-100 text-blue-600',
            'bg-emerald-100 text-emerald-600',
            'bg-amber-100 text-amber-600',
            'bg-violet-100 text-violet-600',
            'bg-rose-100 text-rose-600',
            'bg-cyan-100 text-cyan-600',
            'bg-fuchsia-100 text-fuchsia-600'
        ];
        return colors[id % colors.length];
    };

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-scrollbar">
                <div className="min-w-full">
                    {data.map((entity, index) => (
                        <motion.div
                            key={entity.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{
                                x: 3,
                                backgroundColor: 'rgba(248, 250, 252, 0.8)'
                            }}
                        >
                            <div className="flex items-center p-4">
                                <div className={`w-8 h-8 rounded-full ${getRandomColor(entity.id)} flex items-center justify-center mr-3 shrink-0`}>
                                    <Icon size={16} strokeWidth={1.8} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{entity.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{entity.subtitle}</p>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-xs text-gray-700 truncate max-w-[100px]">{entity.activity}</p>
                                    <div className="flex items-center justify-end mt-1">
                                        <Clock size={12} className="text-green-500 mr-1" strokeWidth={1.8} />
                                        <p className="text-xs text-green-600">{entity.time}</p>
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