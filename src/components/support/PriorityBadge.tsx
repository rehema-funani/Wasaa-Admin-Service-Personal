import React from 'react';
import { AlertTriangle, ChevronUp, ChevronDown, Minus } from 'lucide-react';

interface PriorityBadgeProps {
    priority: 'critical' | 'high' | 'medium' | 'low';
    showIcon?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true, size = 'medium' }) => {
    const priorityConfig = {
        critical: {
            label: 'Critical',
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: AlertTriangle
        },
        high: {
            label: 'High',
            color: 'bg-orange-100 text-orange-700 border-orange-200',
            icon: ChevronUp
        },
        medium: {
            label: 'Medium',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: Minus
        },
        low: {
            label: 'Low',
            color: 'bg-gray-100 text-gray-600 border-gray-200',
            icon: ChevronDown
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

    const config = priorityConfig[priority];
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

export default PriorityBadge;