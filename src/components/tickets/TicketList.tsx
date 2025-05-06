// components/support/tickets/TicketList.tsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    TicketIcon,
    Filter,
    ArrowUpCircle,
    Users
} from 'lucide-react';
import { TicketCard } from './TicketCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Ticket, TicketPriority, TicketStatus } from '../../types/team';

interface TicketListProps {
    tickets: Ticket[];
    isLoading: boolean;
    onAddTicket: () => void;
    onViewTicket: (id: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
    tickets,
    isLoading,
    onAddTicket,
    onViewTicket
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
    const [showEscalatedOnly, setShowEscalatedOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Apply filters
    const filteredTickets = tickets.filter(ticket => {
        // Search query filter
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

        // Priority filter
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

        // Escalated filter
        const matchesEscalated = !showEscalatedOnly || ticket.escalated;

        return matchesSearch && matchesStatus && matchesPriority && matchesEscalated;
    });

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="h-48 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <TicketIcon size={24} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
                </div>
                <Button
                    onClick={onAddTicket}
                    leftIcon={<Plus size={18} />}
                >
                    Create Ticket
                </Button>
            </div>

            <Card className="mb-4">
                <div className="flex items-center justify-between">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        leftIcon={<Filter size={18} />}
                        className="ml-2"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </Button>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showEscalatedOnly}
                                    onChange={() => setShowEscalatedOnly(!showEscalatedOnly)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Escalated Only</span>
                            </label>
                        </div>

                        <div className="flex items-end justify-end md:col-span-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setStatusFilter('all');
                                    setPriorityFilter('all');
                                    setShowEscalatedOnly(false);
                                    setSearchQuery('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-2">
                    <Badge variant="default">
                        Total: {tickets.length}
                    </Badge>
                    <Badge variant="primary">
                        Filtered: {filteredTickets.length}
                    </Badge>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 flex items-center">
                        <ArrowUpCircle size={14} className="text-red-500 mr-1" />
                        Escalated: {tickets.filter(t => t.escalated).length}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                        <Users size={14} className="text-blue-500 mr-1" />
                        Unassigned: {tickets.filter(t => !t.assignedTeam && !t.assignedUser).length}
                    </span>
                </div>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                    <TicketIcon size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
                    <p className="text-gray-500">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || showEscalatedOnly
                            ? 'Try adjusting your filters'
                            : 'Create your first ticket to get started'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && !showEscalatedOnly && (
                        <Button
                            onClick={onAddTicket}
                            leftIcon={<Plus size={16} />}
                            className="mt-4"
                        >
                            Create Ticket
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={onViewTicket}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};