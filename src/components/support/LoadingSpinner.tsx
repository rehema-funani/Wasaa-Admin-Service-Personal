// components/support/LoadingSpinner.tsx

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    fullScreen?: boolean;
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'primary',
    fullScreen = false,
    message
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <div className={`${sizeClasses[size]} animate-spin`}>
                    <div className={`h-full w-full rounded-full border-4 border-gray-200`}></div>
                    <div className={`absolute top-0 left-0 h-full w-full rounded-full border-4 border-${color}-600 border-t-transparent animate-spin`}></div>
                </div>
            </div>
            {message && (
                <p className="text-sm text-gray-600 font-medium">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;