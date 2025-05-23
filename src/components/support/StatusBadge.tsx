// components/support/StatusBadge.tsx

import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

interface StatusBadgeProps {
    status: 'open' | 'pending' | 'resolved' | 'escalated' | 'closed';
    showIcon?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, size = 'medium' }) => {
    const statusConfig = {
        open: {
            label: 'Open',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: AlertCircle
        },
        pending: {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: Clock
        },
        resolved: {
            label: 'Resolved',
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle
        },
        escalated: {
            label: 'Escalated',
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: TrendingUp
        },
        closed: {
            label: 'Closed',
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: XCircle
        }
    };

    const sizeClasses = {
        small: 'px-2 py-0.5 text-xs',
        medium: 'px-2.5 py-1 text-sm',
        large: 'px-3 py-1.5 text-base'
    };

    const iconSizes = {
        small: 12,
        medium: 14,
        large: 16
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span className={`
      inline-flex items-center gap-1 font-medium rounded-lg border
      ${config.color} ${sizeClasses[size]}
    `}>
            {showIcon && <Icon size={iconSizes[size]} />}
            {config.label}
        </span>
    );
};

export default StatusBadge;