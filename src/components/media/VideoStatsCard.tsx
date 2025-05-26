import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface VideoStatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: 'red' | 'green' | 'primary' | 'amber';
    change?: number;
    changeType?: 'increase' | 'decrease';
}

export const VideoStatsCard: React.FC<VideoStatsCardProps> = ({
    title, value, icon, color, change, changeType
}) => {
    const getColorClasses = () => {
        switch (color) {
            case 'red': return 'bg-red-100 text-red-600';
            case 'green': return 'bg-green-100 text-green-600';
            case 'primary': return 'bg-primary-100 text-primary-600';
            case 'amber': return 'bg-amber-100 text-amber-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${getColorClasses()}`}>
                    {icon}
                </div>
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            </div>

            <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>

            {change && (
                <p className={`text-xs mt-1 flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {changeType === 'increase' ? (
                        <ArrowUpRight size={12} className="mr-1" />
                    ) : (
                        <ArrowDownRight size={12} className="mr-1" />
                    )}
                    <span>{change}% from previous period</span>
                </p>
            )}
        </div>
    );
};