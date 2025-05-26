// components/support/tickets/TicketList.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Plus,
    Search,
    TicketIcon,
    Filter,
    ArrowUpCircle,
    Users,
    Clock,
    CheckCircle,
    AlertTriangle,
    FileText,
    ChevronDown,
    Sparkles,
    BarChart,
    RefreshCw,
    X,
    ClipboardList
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Quick filters for status
    const quickStatusFilters: { value: TicketStatus | 'all', label: string, color: string, count: number }[] = [
        { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-800', count: tickets.length },
        { value: 'open', label: 'Open', color: 'bg-primary-100 text-primary-800', count: tickets.filter(t => t.status === 'open').length },
        { value: 'in-progress', label: 'In Progress', color: 'bg-primary-100 text-primary-800', count: tickets.filter(t => t.status === 'in-progress').length },
        { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800', count: tickets.filter(t => t.status === 'pending').length },
        { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800', count: tickets.filter(t => t.status === 'resolved').length },
        { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800', count: tickets.filter(t => t.status === 'closed').length }
    ];

    // Simulate refresh functionality
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    // Apply filters
    const filteredTickets = tickets.filter(ticket => {
        // Search query filter
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ticket.customer?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

        // Status filter
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

        // Priority filter
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

        // Escalated filter
        const matchesEscalated = !showEscalatedOnly || ticket.escalated;

        return matchesSearch && matchesStatus && matchesPriority && matchesEscalated;
    });

    // Sort tickets
    const sortedTickets = [...filteredTickets].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'priority') {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
    });

    // Ticket stats
    const ticketStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
        pending: tickets.filter(t => t.status === 'pending').length,
        resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        escalated: tickets.filter(t => t.escalated).length,
        unassigned: tickets.filter(t => !t.assignedTeam && !t.assignedUser).length,
        critical: tickets.filter(t => t.priority === 'critical').length,
        high: tickets.filter(t => t.priority === 'high').length,
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-10 bg-gray-200 rounded-xl"></div>
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
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <div className="p-2 bg-primary-50 rounded-xl mr-3">
                        <TicketIcon size={24} className="text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and track customer support requests</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{ticketStats.total}</p>
                        </div>
                        <div className="p-3 bg-primary-50 rounded-xl">
                            <ClipboardList size={20} className="text-primary-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                        <span className="text-green-600 flex items-center">
                            <ArrowUpCircle size={12} className="mr-1" />
                            {Math.round((ticketStats.resolved / ticketStats.total) * 100)}% Resolution Rate
                        </span>
                    </div>
                </Card>

                <Card className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Open Tickets</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{ticketStats.open}</p>
                        </div>
                        <div className="p-3 bg-primary-50 rounded-xl">
                            <FileText size={20} className="text-primary-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                        <span className={`${ticketStats.open > ticketStats.resolved ? 'text-amber-600' : 'text-green-600'} flex items-center`}>
                            <Clock size={12} className="mr-1" />
                            {ticketStats.pending} Pending Agent Response
                        </span>
                    </div>
                </Card>

                <Card className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Escalated</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{ticketStats.escalated}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                        <span className="text-red-600 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            {ticketStats.critical} Critical Priority
                        </span>
                    </div>
                </Card>

                <Card className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Unassigned</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{ticketStats.unassigned}</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <Users size={20} className="text-amber-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                        <span className="text-amber-600 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {ticketStats.high} High Priority
                        </span>
                    </div>
                </Card>
            </div>

            {/* Quick status filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                {quickStatusFilters.map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => setStatusFilter(filter.value)}
                        className={`
                            inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-all duration-200
                            ${statusFilter === filter.value
                                ? `${filter.color} ring-2 ring-offset-1 ring-primary-300`
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}
                        `}
                    >
                        {filter.label}
                        <span className="ml-1.5 bg-white bg-opacity-60 text-xs rounded-full px-1.5 py-0.5">
                            {filter.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search and filter bar */}
            <Card className="mb-6 border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tickets by title, description, or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                <X size={16} className="text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Button
                                variant="outline"
                                leftIcon={<BarChart size={16} />}
                                rightIcon={<ChevronDown size={14} />}
                                className="whitespace-nowrap"
                            >
                                {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Priority'}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="priority">Priority</option>
                                </select>
                            </Button>
                        </div>

                        <Button
                            variant={showFilters ? "primary" : "outline"}
                            leftIcon={<Filter size={16} />}
                            onClick={() => setShowFilters(!showFilters)}
                            className="whitespace-nowrap"
                        >
                            {showFilters ? 'Hide Filters' : 'More Filters'}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleRefresh}
                            className={`${isRefreshing ? 'text-primary-600' : 'text-gray-500'}`}
                        >
                            <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={priorityFilter}
                                        onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="all">All Priorities</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        View Options
                                    </label>
                                    <div className="flex h-full">
                                        <div className="flex p-1 bg-gray-100 rounded-lg h-10">
                                            <button
                                                className={`flex-1 flex justify-center items-center rounded-md px-3 py-1 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                onClick={() => setViewMode('grid')}
                                            >
                                                <Sparkles size={16} className={viewMode === 'grid' ? 'text-primary-600' : ''} />
                                                <span className="ml-1.5 text-sm">Grid</span>
                                            </button>
                                            <button
                                                className={`flex-1 flex justify-center items-center rounded-md px-3 py-1 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                onClick={() => setViewMode('list')}
                                            >
                                                <ClipboardList size={16} className={viewMode === 'list' ? 'text-primary-600' : ''} />
                                                <span className="ml-1.5 text-sm">List</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={showEscalatedOnly}
                                            onChange={() => setShowEscalatedOnly(!showEscalatedOnly)}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                                            <ArrowUpCircle size={14} className="text-red-500 mr-1.5" />
                                            Escalated Only
                                        </span>
                                    </label>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => {
                                            setStatusFilter('all');
                                            setPriorityFilter('all');
                                            setShowEscalatedOnly(false);
                                            setSearchQuery('');
                                            setSortBy('newest');
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Results info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="bg-white border border-gray-200 text-gray-700">
                        Showing {sortedTickets.length} of {tickets.length} tickets
                    </Badge>

                    {searchQuery && (
                        <Badge variant="default" className="bg-primary-50 border border-primary-100 text-primary-700 flex items-center gap-1">
                            <Search size={12} />
                            "{searchQuery}"
                        </Badge>
                    )}

                    {statusFilter !== 'all' && (
                        <Badge variant="default" className="bg-primary-50 border border-primary-100 text-primary-700 flex items-center gap-1">
                            <FileText size={12} />
                            Status: {statusFilter}
                        </Badge>
                    )}

                    {priorityFilter !== 'all' && (
                        <Badge variant="default" className="bg-amber-50 border border-amber-100 text-amber-700 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Priority: {priorityFilter}
                        </Badge>
                    )}

                    {showEscalatedOnly && (
                        <Badge variant="default" className="bg-red-50 border border-red-100 text-red-700 flex items-center gap-1">
                            <ArrowUpCircle size={12} />
                            Escalated
                        </Badge>
                    )}
                </div>
            </div>

            {/* Empty state */}
            {sortedTickets.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-12 px-4 rounded-2xl bg-gray-50/60 border border-gray-100"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <TicketIcon size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || showEscalatedOnly
                            ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                            : 'There are no support tickets in the system yet. Create your first ticket to get started.'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && !showEscalatedOnly && (
                        <Button
                            onClick={onAddTicket}
                            leftIcon={<Plus size={16} />}
                            className="mt-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-md"
                        >
                            Create First Ticket
                        </Button>
                    )}
                </motion.div>
            ) : (
                <div className={viewMode === 'grid' ?
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" :
                    "space-y-4"
                }>
                    <AnimatePresence>
                        {sortedTickets.map((ticket, index) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <TicketCard
                                    ticket={ticket}
                                    onClick={onViewTicket}
                                    viewMode={viewMode}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};