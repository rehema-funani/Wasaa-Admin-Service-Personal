import React from 'react';
import { Users, BarChart4 } from 'lucide-react';
import { TransactionType } from '../../types/kyc';

interface TransactionTypeIconProps {
    type: TransactionType;
    size?: number;
}

const TransactionTypeIcon: React.FC<TransactionTypeIconProps> = ({ type, size = 16 }) => {
    const getIcon = () => {
        switch (type) {
            case 'send':
                return <Users size={size} className="text-blue-500" />;
            case 'WITHDRAW':
                return <BarChart4 size={size} className="text-purple-500" />;
            case 'withdraw_mpesa':
                return <BarChart4 size={size} className="text-green-500" />;
            case 'transfer':
                return <BarChart4 size={size} className="text-amber-500" />;
            case 'gift':
                return <BarChart4 size={size} className="text-pink-500" />;
            default:
                return <BarChart4 size={size} className="text-gray-500" />;
        }
    };

    return getIcon();
};

export default TransactionTypeIcon;