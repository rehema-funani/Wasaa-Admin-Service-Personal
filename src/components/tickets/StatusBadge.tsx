import { ArrowUpRight, CheckCircle2, Clock, Info, MessageSquare } from 'lucide-react';
import React from 'react'

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let bgColor = "bg-gray-50";
    let textColor = "text-gray-700";
    let borderColor = "border-gray-100/50";
    let icon = <Info size={12} className="mr-1" />;

    switch (status.toLowerCase()) {
        case 'open':
            bgColor = "bg-primary-50/80";
            textColor = "text-primary-700";
            borderColor = "border-primary-100/50";
            icon = <MessageSquare size={12} className="mr-1 text-primary-500" />;
            break;
        case 'in-progress':
            bgColor = "bg-primary-50/80";
            textColor = "text-primary-700";
            borderColor = "border-primary-100/50";
            icon = <Clock size={12} className="mr-1 text-primary-500" />;
            break;
        case 'resolved':
            bgColor = "bg-green-50/80";
            textColor = "text-green-700";
            borderColor = "border-green-100/50";
            icon = <CheckCircle2 size={12} className="mr-1 text-green-500" />;
            break;
        case 'closed':
            bgColor = "bg-gray-50/80";
            textColor = "text-gray-700";
            borderColor = "border-gray-100/50";
            icon = <CheckCircle2 size={12} className="mr-1 text-gray-500" />;
            break;
        case 'escalated':
            bgColor = "bg-orange-50/80";
            textColor = "text-orange-700";
            borderColor = "border-orange-100/50";
            icon = <ArrowUpRight size={12} className="mr-1 text-orange-500" />;
            break;
    }

    return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-md ${bgColor} ${textColor} border ${borderColor} text-xs font-medium`}>
            {icon}
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </div>
    );
};

export default StatusBadge
