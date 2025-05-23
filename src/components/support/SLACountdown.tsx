import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface SLACountdownProps {
    deadline?: Date;
    status?: 'compliant' | 'at-risk' | 'breached';
    showIcon?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const SLACountdown: React.FC<SLACountdownProps> = ({
    deadline,
    status,
    showIcon = true,
    size = 'medium'
}) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [currentStatus, setCurrentStatus] = useState(status);

    useEffect(() => {
        if (!deadline) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const deadlineTime = new Date(deadline).getTime();
            const difference = deadlineTime - now;

            if (difference < 0) {
                setCurrentStatus('breached');
                const overdue = Math.abs(difference);
                const hours = Math.floor(overdue / (1000 * 60 * 60));
                const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`-${hours}h ${minutes}m`);
            } else {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                // Update status based on time remaining
                if (hours < 1) {
                    setCurrentStatus('at-risk');
                } else {
                    setCurrentStatus('compliant');
                }

                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [deadline, status]);

    if (!deadline) {
        return null;
    }

    const statusConfig = {
        compliant: {
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: Clock,
            animate: false
        },
        'at-risk': {
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: AlertTriangle,
            animate: true
        },
        breached: {
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: AlertTriangle,
            animate: false
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

    const config = statusConfig[currentStatus || 'compliant'];
    const Icon = config.icon;

    return (
        <span className={`
      inline-flex items-center gap-1 font-medium rounded-lg border
      ${config.color} ${sizeClasses[size]}
      ${config.animate ? 'animate-pulse' : ''}
    `}>
            {showIcon && <Icon size={iconSizes[size]} />}
            SLA: {timeLeft}
        </span>
    );
};

export default SLACountdown;