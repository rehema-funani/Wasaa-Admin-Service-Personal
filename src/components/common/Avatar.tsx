import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src?: string;
    alt?: string;
    initials?: string;
    size?: AvatarSize;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    initials,
    size = 'md',
    className = '',
}) => {
    const sizeStyles = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl'
    };

    if (src) {
        return (
            <div
                className={`relative rounded-full overflow-hidden ${sizeStyles[size]} ${className}`}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // If no src is provided, show initials
    return (
        <div
            className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium ${sizeStyles[size]} ${className}`}
        >
            {initials || alt.charAt(0).toUpperCase()}
        </div>
    );
};