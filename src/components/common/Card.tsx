import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    interactive?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    interactive = false,
    padding = 'md'
}) => {
    const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden';
    const interactiveStyles = interactive
        ? 'cursor-pointer transition-all hover:shadow-md hover:border-gray-200'
        : '';

    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };

    return (
        <motion.div
            className={`${baseStyles} ${interactiveStyles} ${paddingStyles[padding]} ${className}`}
            onClick={onClick}
            whileHover={interactive ? { y: -2 } : {}}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`pb-3 mb-3 border-b border-gray-100 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`pt-3 mt-3 border-t border-gray-100 ${className}`}>
            {children}
        </div>
    );
};