// components/support/tickets/TicketCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    TicketIcon,
    Clock,
    AlertTriangle,
    ArrowUpCircle
} from 'lucide-react';
import { Badge, BadgeVariant } from '../common/Badge';
import { formatDistanceToNow } from 'date-fns';
import { Ticket } from '../../types/team';

interface TicketCardProps {
    ticket: Ticket;
    onClick: (ticketId: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
    const priorityBadgeVariant: BadgeVariant | undefined = {
        low: 'default' as BadgeVariant,
        medium: 'info' as BadgeVariant,
        high: 'warning' as BadgeVariant,
        critical: 'danger' as BadgeVariant,
        urgent: 'danger' as BadgeVariant
    }[ticket.priority];

    const statusBadgeVariant: BadgeVariant | undefined = {
        open: 'default' as BadgeVariant,
        'in-progress': 'primary' as BadgeVariant,
        pending: 'warning' as BadgeVariant,
        resolved: 'success' as BadgeVariant,
        closed: 'default' as BadgeVariant
    }[ticket.status];

    const formattedDate = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick(ticket.id)}
        >
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${ticket.escalated
                                ? 'bg-red-100'
                                : 'bg-blue-100'
                            }`}>
                            {ticket.escalated ? (
                                <ArrowUpCircle size={16} className="text-red-600" />
                            ) : (
                                <TicketIcon size={16} className="text-blue-600" />
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className="font-medium text-gray-900 line-clamp-1">{ticket.title}</h3>
                            <div className="flex items-center mt-1 space-x-1 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                    {ticket.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        <Badge variant={statusBadgeVariant} size="sm">
                            {ticket.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant={priorityBadgeVariant} size="sm">
                            {ticket.priority}
                        </Badge>
                    </div>

                    {ticket.escalated && (
                        <Badge variant="danger" size="sm" className="flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            Escalated
                        </Badge>
                    )}
                </div>
            </div>
        </motion.div>
    );
};