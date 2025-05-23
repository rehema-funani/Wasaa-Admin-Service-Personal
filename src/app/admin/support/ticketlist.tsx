// pages/support/TicketList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search, SlidersHorizontal, PlusCircle, Download,
    MessageSquare, CheckSquare, Filter, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Ticket } from '../../../types/support';
import support from '../../../api/services/support';
import SearchBar from '../../../components/support/Searchbar';
import FilterDropdown from '../../../components/support/FilterDropdown';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import EmptyState from '../../../components/support/EmptyState';
import StatusBadge from '../../../components/support/StatusBadge';
import PriorityBadge from '../../../components/support/PriorityBadge';
import AgentAvatar from '../../../components/support/AgentAvatar';
import Pagination from '../../../components/support/Pagination';
import ConfirmationModal from '../../../components/support/ConfirmationModal';
import SLACountdown from '../../../components/support/SLACountdown';

const TicketList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // State
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [totalTickets, setTotalTickets] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [slaFilter, setSlaFilter] = useState<string>(searchParams.get('sla') || 'all');
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [bulkAction, setBulkAction] = useState<'assign' | 'close' | 'escalate' | null>(null);

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, categoryFilter, slaFilter, searchQuery, currentPage, pageSize]);

    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            const filters: any = {
                page: currentPage,
                limit: pageSize,
                search: searchQuery
            };

            if (statusFilter !== 'all') filters.status = statusFilter;
            if (categoryFilter !== 'all') filters.category = categoryFilter;
            if (slaFilter !== 'all') filters.slaStatus = slaFilter;

            const response = await support.getTickets(filters);
            setTickets(response.tickets);
            setTotalTickets(response.total);
        } catch (error) {
            toast.error('Failed to load tickets');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedTickets.length === tickets.length) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(tickets.map(t => t.id));
        }
    };

    const handleSelectTicket = (ticketId: string) => {
        setSelectedTickets(prev =>
            prev.includes(ticketId)
                ? prev.filter(id => id !== ticketId)
                : [...prev, ticketId]
        );
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedTickets.length === 0) return;

        try {
            // Mock bulk action
            await support.bulkUpdateTickets(selectedTickets, { status: 'closed' });
            toast.success(`Successfully ${bulkAction}ed ${selectedTickets.length} tickets`);
            setSelectedTickets([]);
            setBulkAction(null);
            setShowBulkActions(false);
            fetchTickets();
        } catch (error) {
            toast.error('Failed to perform bulk action');
        }
    };

    const totalPages = Math.ceil(totalTickets / pageSize);

    // Filter options
    const statusOptions = [
        { value: 'all', label: 'All Status', count: totalTickets },
        { value: 'open', label: 'Open', count: 23 },
        { value: 'pending', label: 'Pending', count: 12 },
        { value: 'resolved', label: 'Resolved', count: 8 },
        { value: 'escalated', label: 'Escalated', count: 5 },
        { value: 'closed', label: 'Closed', count: 45 }
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'wallet', label: 'Wallet' },
        { value: 'payments', label: 'Payments' },
        { value: 'account', label: 'Account' },
        { value: 'login', label: 'Login' },
        { value: 'general', label: 'General' }
    ];

    const slaOptions = [
        { value: 'all', label: 'All SLA Status' },
        { value: 'compliant', label: 'Compliant' },
        { value: 'at-risk', label: 'At Risk' },
        { value: 'breached', label: 'Breached' }
    ];

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Support Tickets</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage and respond to customer support requests</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={() => navigate('/admin/support/tickets/new')}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all text-sm font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <PlusCircle size={16} />
                                <span>New Ticket</span>
                            </motion.button>
                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        <div className="flex-grow">
                            <SearchBar
                                placeholder="Search tickets by ID, subject, user..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <FilterDropdown
                                label="Status"
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(value) => setStatusFilter(value as string)}
                            />
                            <FilterDropdown
                                label="Category"
                                options={categoryOptions}
                                value={categoryFilter}
                                onChange={(value) => setCategoryFilter(value as string)}
                            />
                            <FilterDropdown
                                label="SLA Status"
                                options={slaOptions}
                                value={slaFilter}
                                onChange={(value) => setSlaFilter(value as string)}
                            />
                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <SlidersHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Selected tickets actions */}
                <AnimatePresence>
                    {selectedTickets.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 flex items-center justify-between bg-indigo-50 rounded-xl p-3 border border-indigo-100"
                        >
                            <div className="flex items-center gap-2">
                                <CheckSquare size={16} className="text-indigo-600" />
                                <span className="text-sm font-medium text-indigo-700">
                                    {selectedTickets.length} ticket{selectedTickets.length > 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setBulkAction('assign');
                                        setShowBulkActions(true);
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                    Assign
                                </button>
                                <button
                                    onClick={() => {
                                        setBulkAction('escalate');
                                        setShowBulkActions(true);
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                    Escalate
                                </button>
                                <button
                                    onClick={() => {
                                        setBulkAction('close');
                                        setShowBulkActions(true);
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => setSelectedTickets([])}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tickets Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size="large" message="Loading tickets..." />
                        </div>
                    ) : tickets.length === 0 ? (
                        <EmptyState
                            icon={MessageSquare}
                            title="No tickets found"
                            description="Try adjusting your filters or search query"
                            action={{
                                label: 'Clear Filters',
                                onClick: () => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                    setCategoryFilter('all');
                                    setSlaFilter('all');
                                }
                            }}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="w-12 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedTickets.length === tickets.length && tickets.length > 0}
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Ticket ID</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Subject</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">User</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Category</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Priority</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Agent</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">SLA</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => navigate(`/admin/support/tickets/${ticket.id}`)}
                                        >
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTickets.includes(ticket.id)}
                                                    onChange={() => handleSelectTicket(ticket.id)}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-medium text-gray-900">#{ticket.id}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-900 truncate max-w-xs">{ticket.subject}</span>
                                                    {ticket.unreadCount && ticket.unreadCount > 0 && (
                                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                                                            {ticket.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                                        {ticket.user?.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{ticket.user?.name}</p>
                                                        <p className="text-xs text-gray-500">{ticket.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-700 capitalize">{ticket.category}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge status={ticket.status} size="small" />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <PriorityBadge priority={ticket.priority} size="small" />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {ticket.assignedAgent ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <AgentAvatar
                                                            name={ticket.assignedAgent.name}
                                                            status={ticket.assignedAgent.status}
                                                            size="small"
                                                        />
                                                        <span className="text-sm text-gray-700">{ticket.assignedAgent.name.split(' ')[0]}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <SLACountdown
                                                    deadline={ticket.slaDeadline}
                                                    status={ticket.slaStatus}
                                                    size="small"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && tickets.length > 0 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={pageSize}
                            totalItems={totalTickets}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                )}

                {/* Bulk Action Modal */}
                <ConfirmationModal
                    isOpen={showBulkActions}
                    onClose={() => {
                        setShowBulkActions(false);
                        setBulkAction(null);
                    }}
                    onConfirm={handleBulkAction}
                    title={`${bulkAction?.charAt(0).toUpperCase()}${bulkAction?.slice(1)} ${selectedTickets.length} Tickets`}
                    message={`Are you sure you want to ${bulkAction} the selected tickets? This action cannot be undone.`}
                    confirmText={bulkAction?.charAt(0).toUpperCase() + bulkAction?.slice(1) || 'Confirm'}
                    type="warning"
                />
            </div>
        </div>
    );
};

export default TicketList;