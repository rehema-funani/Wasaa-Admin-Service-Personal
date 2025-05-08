import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    AlertTriangle,
    MessageSquare,
    ArrowUpRight,
    Clock,
    Users,
    Send,
    ExternalLink,
    Calendar,
    Lock
} from 'lucide-react';
import { Team, Ticket } from '../../../types/team';
import { ticketService } from '../../../api/services/ticket';
import { teamService } from '../../../api/services/team';
import { Button } from '../../../components/common/Button';
import { Avatar } from '../../../components/common/Avatar';
import { Card, CardContent, CardHeader, CardFooter } from '../../../components/common/Card';
import toast from 'react-hot-toast';
import AssignmentModal from '../../../components/tickets/AssignmentModal';
import PriorityBadge from '../../../components/tickets/PriorityBadge';
import EscalationModal from '../../../components/tickets/EscalationModal';
import StatusBadge from '../../../components/common/StatusBadge';

const viewticket: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEscalateModal, setShowEscalateModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const currentUser = { id: 'current_user_id' };

    useEffect(() => {
        if (id) {
            fetchTicketData(id);
        }
    }, [id]);

    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments]);

    const fetchTicketData = async (ticketId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const [ticketData, commentsData, teamsData] = await Promise.all([
                ticketService.getTicket(ticketId),
                ticketService.getTicketComments(ticketId),
                teamService.getTeams()
            ]);

            setTicket(ticketData);
            setComments(commentsData.comments || []);
            setTeams(teamsData.teams || []);
        } catch (err) {
            setError('Failed to fetch ticket details. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignTicket = async (teamId?: string, userId?: string) => {
        if (!id) return;

        setIsSubmitting(true);

        try {
            if (teamId && teamId.trim() !== '') {
                await ticketService.assignTicketToTeam(id, teamId);
            } else if (userId && userId.trim() !== '') {
                await ticketService.assignTicketToUser(id, userId);
            } else {
                console.log("No valid team or user ID provided for assignment");
            }

            setTicket(prevTicket => {
                if (!prevTicket) return null;

                return {
                    ...prevTicket,
                    assignedTeam: teamId,
                    assignedUser: userId
                };
            });

            setShowAssignModal(false);
            toast.success('Ticket assigned successfully!');
        } catch (err) {
            setError('Failed to assign ticket. Please try again later.');
            console.error(err);
            toast.error('Failed to assign ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEscalateTicket = async (escalationData: any) => {
        if (!id) return;

        setIsSubmitting(true);

        try {
            const payload = {
                team_id: escalationData.newAssignment?.teamId,
                escalation_reason: escalationData.reason
            };

            await ticketService.escalateTicket(id, payload);

            setTicket(prevTicket => {
                if (!prevTicket) return null;

                return {
                    ...prevTicket,
                    escalated: true,
                    escalationReason: escalationData.reason,
                    assignedTeam: escalationData.newAssignment?.teamId,
                    assignedUser: escalationData.newAssignment?.userId
                };
            });

            setShowEscalateModal(false);
            toast.success('Ticket escalated successfully!');
        } catch (err) {
            setError('Failed to escalate ticket. Please try again later.');
            console.error(err);
            toast.error('Failed to escalate ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);

        try {
            const commentData = {
                authored_by: currentUser.id,
                comment: newComment
            };

            if (!id) {
                throw new Error('Ticket ID is undefined');
            }
            const newCommentData = await ticketService.createTicketComment(id, commentData);

            setComments(prevComments => [newCommentData, ...prevComments]);
            setNewComment('');
            toast.success('Comment added successfully!');
        } catch (err) {
            setError('Failed to add comment. Please try again later.');
            console.error(err);
            toast.error('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !ticket) {
        return (
            <div className="p-5">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-100 rounded w-1/2"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="h-40 bg-gray-100 rounded lg:col-span-2"></div>
                        <div className="h-40 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="p-5">
                <div className="text-center py-10 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100/70 shadow-sm">
                    <div className="bg-red-50/50 p-3 rounded-lg w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Not Found</h3>
                    <p className="text-gray-500 text-sm mb-5">
                        The ticket you're looking for doesn't exist or has been deleted.
                    </p>
                    <Button
                        onClick={() => navigate(-1)}
                        leftIcon={<ChevronLeft size={14} />}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                    >
                        Back to Tickets
                    </Button>
                </div>
            </div>
        );
    }

    const assignedTeam = teams.find(t => t.id === ticket.assignedTeam);
    const assignedUser = assignedTeam?.members?.find(m => m.id === ticket.assignedUser);

    return (
        <>
            <div className="p-5">
                {error && (
                    <div className="bg-red-50/70 backdrop-blur-sm border border-red-100/70 text-red-600 px-4 py-2.5 rounded-lg mx-5 my-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ChevronLeft size={14} />}
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 text-sm py-1.5 rounded-lg transition-colors duration-200"
                        >
                            Back to Tickets
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm h-full">
                            <CardHeader className="border-b border-gray-100/50 pb-3">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <StatusBadge status={ticket.status} />
                                        <PriorityBadge priority={ticket.priority} />

                                        {ticket.ticket_number && (
                                            <span className="text-xs font-mono bg-gray-50/80 text-gray-500 px-2 py-0.5 rounded border border-gray-100/50">
                                                #{ticket.ticket_number}
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-lg font-semibold text-gray-900">{ticket.title}</h1>

                                    <div className="flex items-center mt-2 text-xs text-gray-500">
                                        <Calendar size={12} className="mr-1" />
                                        <span>
                                            Created {new Date(ticket.createdAt).toLocaleString()}
                                        </span>

                                        {ticket.updatedAt && (
                                            <span className="ml-4">
                                                <Clock size={12} className="inline mr-1" />
                                                Updated {new Date(ticket.updatedAt).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {ticket.description}
                                </div>

                                {ticket.customer && (
                                    <div className="mt-5 bg-gray-50/80 p-3 rounded-lg border border-gray-100/50">
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Customer Information
                                        </h3>
                                        <div className="flex items-start">
                                            <Avatar
                                                src={ticket.customer.avatar}
                                                alt={ticket.customer.name}
                                                initials={ticket.customer.name?.charAt(0)}
                                                size="sm"
                                                className="border border-gray-100"
                                            />
                                            <div className="ml-3">
                                                <div className="font-medium text-gray-900 text-sm">{ticket.customerName}</div>
                                                <div className="text-xs text-gray-500">{ticket.customerEmai}</div>
                                                {ticket.customer.phone && (
                                                    <div className="text-xs text-gray-500 mt-1">{ticket.customer.phone}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                            <CardHeader className="border-b border-gray-100/50 pb-3">
                                <h2 className="text-base font-medium text-gray-900">Ticket Details</h2>
                            </CardHeader>

                            <CardContent className="py-3">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                            Assignment
                                        </h3>

                                        {assignedTeam ? (
                                            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                                                <div className="flex items-center mb-2">
                                                    <Users size={14} className="text-blue-500 mr-2" />
                                                    <span className="text-sm font-medium">{assignedTeam.title}</span>
                                                </div>

                                                {assignedUser ? (
                                                    <div className="flex items-center">
                                                        <Avatar
                                                            src={assignedUser.avatar}
                                                            alt={assignedUser.name}
                                                            initials={assignedUser.name?.charAt(0)}
                                                            size="xs"
                                                            className="border border-white"
                                                        />
                                                        <span className="ml-2 text-xs">{assignedUser.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-500">
                                                        No agent assigned
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100/50 text-center">
                                                <div className="text-sm text-gray-500 mb-2">Not assigned yet</div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowAssignModal(true)}
                                                    className="border-blue-100/50 text-blue-600 hover:bg-blue-50/50 text-xs w-full"
                                                >
                                                    Assign Ticket
                                                </Button>
                                            </div>
                                        )}

                                        {assignedTeam && (
                                            <div className="mt-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowAssignModal(true)}
                                                    className="border-gray-100/70 text-gray-600 hover:bg-gray-50/90 text-xs w-full"
                                                >
                                                    Change Assignment
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {ticket.escalated ? (
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                                Escalation
                                            </h3>
                                            <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
                                                <div className="flex items-center mb-2">
                                                    <ArrowUpRight size={14} className="text-orange-500 mr-2" />
                                                    <span className="text-sm font-medium">
                                                        {ticket.escalationLevel || 'Escalated'}
                                                    </span>
                                                </div>
                                                {ticket.escalationReason && (
                                                    <div className="text-xs text-gray-700 border-t border-orange-100/50 pt-2 mt-2">
                                                        <div className="font-medium mb-1">Reason:</div>
                                                        {ticket.escalationReason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                                Escalation
                                            </h3>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setShowEscalateModal(true)}
                                                className="border-orange-100/50 text-orange-600 hover:bg-orange-50/50 text-xs w-full"
                                                leftIcon={<ArrowUpRight size={14} />}
                                            >
                                                Escalate Ticket
                                            </Button>
                                        </div>
                                    )}

                                    {ticket.category && (
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                                Category
                                            </h3>
                                            <div className="bg-gray-50/50 px-3 py-2 rounded-lg border border-gray-100/50 text-sm">
                                                {ticket.category}
                                            </div>
                                        </div>
                                    )}

                                    {ticket.source && (
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                                Source
                                            </h3>
                                            <div className="bg-gray-50/50 px-3 py-2 rounded-lg border border-gray-100/50 text-sm">
                                                {ticket.source}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                            <CardHeader className="border-b border-gray-100/50 pb-3">
                                <h2 className="text-base font-medium text-gray-900">Comments</h2>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="max-h-96 overflow-y-auto p-4">
                                    {comments?.length === 0 ? (
                                        <div className="text-center py-6">
                                            <MessageSquare size={24} className="text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No comments yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {comments?.map((comment, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg ${comment.isInternal
                                                        ? 'bg-indigo-50/50 border border-indigo-100/50'
                                                        : 'bg-gray-50/50 border border-gray-100/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <Avatar
                                                                src={comment.user?.avatar}
                                                                alt={comment.user?.name}
                                                                initials={comment.user?.name?.charAt(0)}
                                                                size="xs"
                                                                className="border border-white"
                                                            />
                                                            <span className="ml-2 text-xs font-medium">
                                                                {comment.user?.name || 'System'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {comment.isInternal && (
                                                                <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                                                                    <Lock size={10} className="mr-1" />
                                                                    Internal
                                                                </div>
                                                            )}
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(comment.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {comment.comment}
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={commentsEndRef} />
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="border-t border-gray-100/50 pt-3">
                                <div className="w-full">
                                    {/* <div className="flex items-center justify-between mb-2">
                                        <label className="flex items-center text-xs text-gray-500">
                                            <input
                                                type="checkbox"
                                                checked={isInternalComment}
                                                onChange={(e) => setIsInternalComment(e.target.checked)}
                                                className="mr-1.5 rounded text-blue-500 focus:ring-blue-500/50"
                                            />
                                            Internal comment (only visible to support staff)
                                        </label>
                                    </div> */}

                                    <div className="flex gap-2">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-grow px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200"
                                            rows={3}
                                        />

                                        <Button
                                            onClick={handleAddComment}
                                            disabled={isSubmitting || !newComment.trim()}
                                            isLoading={isSubmitting}
                                            className={`self-end bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all duration-200 py-2 px-4 ${!newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <Send size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>

            <AssignmentModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onAssign={handleAssignTicket}
                teams={teams.map(team => ({
                    ...team,
                    members: team.members.filter(member => member.name !== undefined) as { id: string; name: string }[]
                }))}
                currentTeamId={ticket.assignedTeam}
                currentUserId={ticket.assignedUser}
                isSubmitting={isSubmitting}
            />

            <EscalationModal
                isOpen={showEscalateModal}
                onClose={() => setShowEscalateModal(false)}
                onEscalate={handleEscalateTicket}
                teams={teams}
                currentLevel={String(ticket.escalationLevel || 'LEVEL_1')}
                isSubmitting={isSubmitting}
            />

            <style>{`
                /* iOS 18-like glass morphism */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
            `}</style>
        </>
    );
};

export default viewticket;