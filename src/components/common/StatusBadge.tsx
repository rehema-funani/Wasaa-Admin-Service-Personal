import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    AlertCircle,
    Info,
    Ban,
    Loader
} from 'lucide-react';

type StatusType =
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'pending'
    | 'active'
    | 'inactive'
    | 'processing'
    | 'completed'
    | 'cancelled'
    | 'blocked'
    | 'draft'
    | 'loading'
    | 'custom';

interface StatusBadgeProps {
    status: StatusType;
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    withIcon?: boolean;
    withDot?: boolean;
    withPulse?: boolean;
    customColors?: {
        bg: string;
        text: string;
        icon?: string;
        border?: string;
    };
    icon?: React.ReactNode;
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    text,
    size = 'md',
    withIcon = true,
    withDot = false,
    withPulse = false,
    customColors,
    icon,
    className = ''
}) => {
    // Determine label if not provided
    const defaultLabel = (() => {
        switch (status) {
            case 'success': return 'Success';
            case 'error': return 'Error';
            case 'warning': return 'Warning';
            case 'info': return 'Info';
            case 'pending': return 'Pending';
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'processing': return 'Processing';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            case 'blocked': return 'Blocked';
            case 'draft': return 'Draft';
            case 'loading': return 'Loading';
            default: return '';
        }
    })();

    const label = text || defaultLabel;

    // Define style configurations
    const getStatusStyles = () => {
        if (customColors) {
            return {
                background: customColors.bg,
                textColor: customColors.text,
                iconColor: customColors.icon || customColors.text,
                borderColor: customColors.border || 'transparent'
            };
        }

        switch (status) {
            case 'success':
                return {
                    background: 'bg-green-50',
                    textColor: 'text-green-700',
                    iconColor: 'text-green-500',
                    borderColor: 'border-green-100'
                };
            case 'error':
                return {
                    background: 'bg-red-50',
                    textColor: 'text-red-700',
                    iconColor: 'text-red-500',
                    borderColor: 'border-red-100'
                };
            case 'warning':
                return {
                    background: 'bg-amber-50',
                    textColor: 'text-amber-700',
                    iconColor: 'text-amber-500',
                    borderColor: 'border-amber-100'
                };
            case 'info':
                return {
                    background: 'bg-primary-50',
                    textColor: 'text-primary-700',
                    iconColor: 'text-primary-500',
                    borderColor: 'border-primary-100'
                };
            case 'pending':
                return {
                    background: 'bg-purple-50',
                    textColor: 'text-purple-700',
                    iconColor: 'text-purple-500',
                    borderColor: 'border-purple-100'
                };
            case 'active':
                return {
                    background: 'bg-green-50',
                    textColor: 'text-green-700',
                    iconColor: 'text-green-500',
                    borderColor: 'border-green-100'
                };
            case 'inactive':
                return {
                    background: 'bg-gray-50',
                    textColor: 'text-gray-700',
                    iconColor: 'text-gray-500',
                    borderColor: 'border-gray-100'
                };
            case 'processing':
                return {
                    background: 'bg-primary-50',
                    textColor: 'text-primary-700',
                    iconColor: 'text-primary-500',
                    borderColor: 'border-primary-100'
                };
            case 'completed':
                return {
                    background: 'bg-teal-50',
                    textColor: 'text-teal-700',
                    iconColor: 'text-teal-500',
                    borderColor: 'border-teal-100'
                };
            case 'cancelled':
                return {
                    background: 'bg-rose-50',
                    textColor: 'text-rose-700',
                    iconColor: 'text-rose-500',
                    borderColor: 'border-rose-100'
                };
            case 'blocked':
                return {
                    background: 'bg-red-50',
                    textColor: 'text-red-700',
                    iconColor: 'text-red-500',
                    borderColor: 'border-red-100'
                };
            case 'draft':
                return {
                    background: 'bg-slate-50',
                    textColor: 'text-slate-700',
                    iconColor: 'text-slate-500',
                    borderColor: 'border-slate-100'
                };
            case 'loading':
                return {
                    background: 'bg-primary-50',
                    textColor: 'text-primary-700',
                    iconColor: 'text-primary-500',
                    borderColor: 'border-primary-100'
                };
            default:
                return {
                    background: 'bg-gray-50',
                    textColor: 'text-gray-700',
                    iconColor: 'text-gray-500',
                    borderColor: 'border-gray-100'
                };
        }
    };

    // Get icon based on status
    const getStatusIcon = () => {
        const { iconColor } = getStatusStyles();
        const iconClassName = `${iconColor} ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`;

        if (icon) return icon;

        switch (status) {
            case 'success':
                return <CheckCircle className={iconClassName} strokeWidth={1.8} />;
            case 'error':
                return <XCircle className={iconClassName} strokeWidth={1.8} />;
            case 'warning':
                return <AlertTriangle className={iconClassName} strokeWidth={1.8} />;
            case 'info':
                return <Info className={iconClassName} strokeWidth={1.8} />;
            case 'pending':
                return <Clock className={iconClassName} strokeWidth={1.8} />;
            case 'active':
                return <CheckCircle className={iconClassName} strokeWidth={1.8} />;
            case 'inactive':
                return <Ban className={iconClassName} strokeWidth={1.8} />;
            case 'processing':
                return <Loader className={`${iconClassName} animate-spin`} strokeWidth={1.8} />;
            case 'completed':
                return <CheckCircle className={iconClassName} strokeWidth={1.8} />;
            case 'cancelled':
                return <XCircle className={iconClassName} strokeWidth={1.8} />;
            case 'blocked':
                return <Ban className={iconClassName} strokeWidth={1.8} />;
            case 'draft':
                return <AlertCircle className={iconClassName} strokeWidth={1.8} />;
            case 'loading':
                return <Loader className={`${iconClassName} animate-spin`} strokeWidth={1.8} />;
            default:
                return null;
        }
    };

    // Size classes
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'text-xs py-0.5 px-2';
            case 'lg':
                return 'text-sm py-1.5 px-3';
            default: // md
                return 'text-xs py-1 px-2.5';
        }
    };

    const { background, textColor, borderColor } = getStatusStyles();
    const sizeClasses = getSizeClasses();

    return (
        <motion.div
            className={`
        inline-flex items-center rounded-full border ${background} ${textColor} ${borderColor}
        ${withPulse ? 'animate-pulse' : ''}
        ${sizeClasses}
        ${className}
      `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            {withDot && (
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${textColor} ${withPulse ? 'animate-ping' : ''}`}></span>
            )}

            {withIcon && getStatusIcon() && (
                <span className="mr-1 flex-shrink-0">{getStatusIcon()}</span>
            )}

            <span className="font-medium whitespace-nowrap">{label}</span>
        </motion.div>
    );
};

export default StatusBadge;