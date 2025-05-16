import React from 'react';
import { Shield, User } from 'lucide-react';
import { KycLevel } from '../../types/kyc';

interface KycLevelIconProps {
    level: KycLevel;
    size?: number;
}

const KycLevelIcon: React.FC<KycLevelIconProps> = ({ level, size = 16 }) => {
    const getKycLevelIcon = (level: KycLevel) => {
        switch (level) {
            case 'basic':
                return { icon: <User size={size} />, color: 'text-blue-500 bg-blue-50' };
            case 'standard':
                return { icon: <Shield size={size} />, color: 'text-amber-500 bg-amber-50' };
            case 'advanced':
                return { icon: <Shield size={size} />, color: 'text-green-500 bg-green-50' };
            default:
                return { icon: <User size={size} />, color: 'text-gray-500 bg-gray-50' };
        }
    };

    const { icon, color } = getKycLevelIcon(level);

    return (
        <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${color}`}>
            {icon}
        </div>
    );
};

export default KycLevelIcon;