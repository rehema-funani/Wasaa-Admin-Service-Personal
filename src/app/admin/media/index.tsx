import React, { useState } from 'react';
import { Video, Flag, Users, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VideoStatsCard } from '../../../components/media/VideoStatsCard';

const MediaDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

    type Stat = {
        title: string;
        value: number | string;
        icon: React.ReactNode;
        color: 'amber' | 'red' | 'green' | 'blue';
    };

    const stats: Stat[] = [
        { title: 'Pending Reviews', value: 42, icon: <Clock size={20} />, color: 'amber' },
        { title: 'Flagged Content', value: 18, icon: <AlertTriangle size={20} />, color: 'red' },
        { title: 'Compliance Rate', value: '98.2%', icon: <ShieldCheck size={20} />, color: 'green' },
        { title: 'Active Creators', value: 1256, icon: <Users size={20} />, color: 'blue' }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Shorts Video Dashboard</h1>

                <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-0.5">
                    {(['today', 'week', 'month'] as const).map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === range ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, idx) => (
                    <VideoStatsCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 col-span-2 p-5">
                    <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
                    {/* Activity content would go here */}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h2 className="text-lg font-medium mb-4">Review SLA</h2>
                    {/* SLA metrics would go here */}
                </div>
            </div>
        </div>
    );
};

export default MediaDashboard;