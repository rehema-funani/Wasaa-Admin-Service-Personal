import React from 'react';

interface AgentAvatarProps {
    name: string;
    email?: string;
    status?: 'online' | 'offline' | 'suspended' | 'inactive';
    size?: 'small' | 'medium' | 'large';
    showStatus?: boolean;
    avatar?: string;
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({
    name,
    email,
    status = 'offline',
    size = 'medium',
    showStatus = true,
    avatar
}) => {
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const sizeClasses = {
        small: 'w-8 h-8 text-xs',
        medium: 'w-10 h-10 text-sm',
        large: 'w-12 h-12 text-base'
    };

    const statusSizeClasses = {
        small: 'w-2 h-2',
        medium: 'w-2.5 h-2.5',
        large: 'w-3 h-3'
    };

    const statusPositionClasses = {
        small: '-bottom-0.5 -right-0.5',
        medium: '-bottom-0.5 -right-0.5',
        large: '-bottom-1 -right-1'
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        suspended: 'bg-orange-500',
        inactive: 'bg-red-500'
    };

    const backgroundColors = [
        'bg-primary-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-primary-500',
        'bg-yellow-500'
    ];

    const colorIndex = name.charCodeAt(0) % backgroundColors.length;
    const backgroundColor = backgroundColors[colorIndex];

    return (
        <div className="relative inline-flex">
            <div className={`
        ${sizeClasses[size]} 
        ${backgroundColor}
        rounded-full flex items-center justify-center text-white font-medium
      `}>
                {avatar || getInitials(name)}
            </div>
            {showStatus && (
                <span className={`
          absolute ${statusPositionClasses[size]} 
          ${statusSizeClasses[size]} 
          ${statusColors[status]}
          rounded-full border-2 border-white
        `} />
            )}
        </div>
    );
};

export default AgentAvatar;