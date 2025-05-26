import { Tag } from 'lucide-react';
import React from 'react'

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    let bgColor = "bg-gray-50";
    let textColor = "text-gray-700";
    let borderColor = "border-gray-100/50";

    switch (priority.toLowerCase()) {
        case 'low':
            bgColor = "bg-gray-50/80";
            textColor = "text-gray-700";
            borderColor = "border-gray-100/50";
            break;
        case 'medium':
            bgColor = "bg-primary-50/80";
            textColor = "text-primary-700";
            borderColor = "border-primary-100/50";
            break;
        case 'high':
            bgColor = "bg-orange-50/80";
            textColor = "text-orange-700";
            borderColor = "border-orange-100/50";
            break;
        case 'critical':
            bgColor = "bg-red-50/80";
            textColor = "text-red-700";
            borderColor = "border-red-100/50";
            break;
    }

    return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-md ${bgColor} ${textColor} border ${borderColor} text-xs font-medium`}>
            <Tag size={12} className="mr-1" />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </div>
    );
};

export default PriorityBadge
