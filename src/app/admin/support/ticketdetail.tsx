import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Send, Paperclip, Tag,
    MessageSquare, MoreVertical,
    Sparkles, History, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CannedResponse, Ticket } from '../../../types/support';
import support from '../../../api/services/support';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import StatusBadge from '../../../components/support/StatusBadge';
import PriorityBadge from '../../../components/support/PriorityBadge';
import SLACountdown from '../../../components/support/SLACountdown';
import AgentAvatar from '../../../components/support/AgentAvatar';

const TicketDetail: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const messageEndRef = useRef<HTMLDivElement>(null);

    // State
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showCannedResponses, setShowCannedResponses] = useState(false);
    const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [showAssignMenu, setShowAssignMenu] = useState(false);
    const [agents, setAgents] = useState<any[]>([]);

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
            fetchCannedResponses();
            fetchAgents();
        }
    }, [ticketId]);

    useEffect(() => {
        scrollToBottom();
    }, [ticket?.messages]);

    const fetchTicketDetails = async () => {
        try {
            setIsLoading(true);
            const data = await support.getTicketById(ticketId);
            setTicket(data);
        } catch (error) {
            toast.error('Failed to load ticket details');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCannedResponses = async () => {
        try {
            const responses = await support.getCannedResponses();
            setCannedResponses(responses);
        } catch (error) {
            console.error('Failed to load canned responses', error);
        }
    };

    const fetchAgents = async () => {
        try {
            const agentList = await support.getAgents({ status: 'online' });
            setAgents(agentList);
        } catch (error) {
            console.error('Failed to load agents', error);
        }
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendReply = async () => {
        if (!replyContent.trim() || !ticket) return;

        setIsReplying(true);
        try {
            await support.sendMessage(ticket.id, {
                content: replyContent,
                senderId: 'agt_1', // Current agent ID
                senderType: 'agent'
            });
            setReplyContent('');
            fetchTicketDetails(); // Refresh to show new message
            toast.success('Reply sent successfully');
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setIsReplying(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!ticket) return;

        try {
            await support.updateTicket(ticket.id, { status: newStatus as any });
            setTicket({ ...ticket, status: newStatus as any });
            toast.success(`Ticket status updated to ${newStatus}`);
            setShowStatusMenu(false);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handlePriorityChange = async (newPriority: string) => {
        if (!ticket) return;

        try {
            await support.updateTicket(ticket.id, { priority: newPriority as any });
            setTicket({ ...ticket, priority: newPriority as any });
            toast.success(`Priority updated to ${newPriority}`);
            setShowPriorityMenu(false);
        } catch (error) {
            toast.error('Failed to update priority');
        }
    };

    const handleAssignAgent = async (agentId: string) => {
        if (!ticket) return;

        try {
            await support.updateTicket(ticket.id, { assignedAgentId: agentId });
            const agent = agents.find(a => a.id === agentId);
            setTicket({ ...ticket, assignedAgentId: agentId, assignedAgent: agent });
            toast.success(`Ticket assigned to ${agent?.name}`);
            setShowAssignMenu(false);
        } catch (error) {
            toast.error('Failed to assign agent');
        }
    };

    const insertCannedResponse = (response: CannedResponse) => {
        setReplyContent(response.content);
        setShowCannedResponses(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FCFCFD] p-6 flex items-center justify-center">
                <LoadingSpinner size="large" message="Loading ticket..." />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-[#FCFCFD] p-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket not found</h2>
                    <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/admin/support/tickets')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCFCFD] font-['Inter',sans-serif]">
            <div className="flex h-screen">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/admin/support/tickets')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        {ticket.subject}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-gray-500">#{ticket.id}</span>
                                        <StatusBadge status={ticket.status} size="small" />
                                        <PriorityBadge priority={ticket.priority} size="small" />
                                        <SLACountdown
                                            deadline={ticket.slaDeadline}
                                            status={ticket.slaStatus}
                                            size="small"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <History size={20} />
                                </button>
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {ticket.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-2xl ${message.senderType === 'agent' ? 'order-2' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            {message.senderType === 'user' && (
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                                                    {ticket.user?.avatar}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`
                          rounded-2xl px-4 py-3 
                          ${message.senderType === 'agent'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white border border-gray-200'
                                                    }
                        `}>
                                                    <p className={`text-sm ${message.senderType === 'agent' ? 'text-white' : 'text-gray-900'}`}>
                                                        {message.content}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 px-1">
                                                    <span className="text-xs text-gray-500">
                                                        {message.senderName || 'Unknown'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                            {message.senderType === 'agent' && (
                                                <AgentAvatar
                                                    name={message.senderName || 'Agent'}
                                                    status="online"
                                                    size="medium"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                    </div>

                    {/* Reply Box */}
                    <div className="bg-white border-t border-gray-200 p-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendReply();
                                            }
                                        }}
                                        placeholder="Type your reply..."
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                                        rows={3}
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Paperclip size={20} />
                                            </button>
                                            <button
                                                onClick={() => setShowCannedResponses(!showCannedResponses)}
                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MessageSquare size={20} />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Sparkles size={20} />
                                            </button>
                                        </div>
                                        <motion.button
                                            onClick={handleSendReply}
                                            disabled={!replyContent.trim() || isReplying}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isReplying ? (
                                                <LoadingSpinner size="small" color="white" />
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    <span className="text-sm font-medium">Send</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Canned Responses Dropdown */}
                            <AnimatePresence>
                                {showCannedResponses && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-60 overflow-y-auto"
                                    >
                                        <p className="text-xs font-medium text-gray-500 px-3 py-2">CANNED RESPONSES</p>
                                        {cannedResponses.map((response) => (
                                            <button
                                                key={response.id}
                                                onClick={() => insertCannedResponse(response)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <p className="text-sm font-medium text-gray-900">{response.title}</p>
                                                <p className="text-xs text-gray-500 truncate">{response.content}</p>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                    {/* User Info */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer</h3>
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-medium text-gray-700">
                                {ticket.user?.avatar}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{ticket.user?.name}</p>
                                <p className="text-sm text-gray-500">{ticket.user?.email}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {ticket.user?.accountType} account
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
                        <div className="space-y-3">
                            {/* Status */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        <StatusBadge status={ticket.status} size="small" />
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </button>
                                    {showStatusMenu && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            {['open', 'pending', 'resolved', 'escalated', 'closed'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(status)}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm capitalize"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Priority</p>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        <PriorityBadge priority={ticket.priority} size="small" />
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </button>
                                    {showPriorityMenu && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            {['critical', 'high', 'medium', 'low'].map((priority) => (
                                                <button
                                                    key={priority}
                                                    onClick={() => handlePriorityChange(priority)}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm capitalize"
                                                >
                                                    {priority}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <p className="text-sm text-gray-900 capitalize">{ticket.category}</p>
                            </div>

                            {/* Assigned Agent */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Assigned to</p>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAssignMenu(!showAssignMenu)}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        {ticket.assignedAgent ? (
                                            <>
                                                <AgentAvatar
                                                    name={ticket.assignedAgent.name}
                                                    status={ticket.assignedAgent.status}
                                                    size="small"
                                                />
                                                <span className="text-sm">{ticket.assignedAgent.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-400">Unassigned</span>
                                        )}
                                        <ChevronDown size={14} className="text-gray-400 ml-auto" />
                                    </button>
                                    {showAssignMenu && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {agents.map((agent) => (
                                                <button
                                                    key={agent.id}
                                                    onClick={() => handleAssignAgent(agent.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <AgentAvatar
                                                        name={agent.name}
                                                        status={agent.status}
                                                        size="small"
                                                    />
                                                    <span className="text-sm">{agent.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Created Date */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created</p>
                                <p className="text-sm text-gray-900">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* Updated Date */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                                <p className="text-sm text-gray-900">
                                    {new Date(ticket.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {ticket.tags && ticket.tags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {ticket.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                                    >
                                        <Tag size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Suggestions */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Sparkles size={16} className="text-indigo-600" />
                            AI Suggestions
                        </h3>
                        <div className="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-700">
                            Based on similar tickets, consider checking the user's wallet transaction history for any pending operations.
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                            Escalate to Supervisor
                        </button>
                        <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                            Add Internal Note
                        </button>
                        <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                            View Similar Tickets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;