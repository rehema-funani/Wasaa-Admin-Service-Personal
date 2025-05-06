import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    AlertTriangle,
    Edit
} from 'lucide-react';
import { Team, Ticket, TicketComment, TicketEscalationFormData, TicketFormData } from '../../../types/team';
import { ticketService } from '../../../api/services/ticket';
import { teamService } from '../../../api/services/team';
import { Button } from '../../../components/common/Button';
import { TicketForm } from '../../../components/tickets/TicketForm';
import { Modal } from '../../../components/common/Modal';

const TicketDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchTicketData(id);
        }
    }, [id]);

    const fetchTicketData = async (ticketId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch ticket details, comments, and teams in parallel
            const [ticketData, commentsData, teamsData] = await Promise.all([
                ticketService.getTicket(ticketId),
                ticketService.getTicketComments(ticketId),
                teamService.getTeams()
            ]);

            setTicket(ticketData);
            setComments(commentsData);
            setTeams(teamsData);
        } catch (err) {
            setError('Failed to fetch ticket details. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignTicket = async (
        ticketId: string,
        teamId?: string,
        userId?: string
    ) => {
        setIsSubmitting(true);

        try {
            await ticketService.assignTicket(ticketId, { teamId, userId });

            // Update ticket with new assignment
            setTicket(prevTicket => {
                if (!prevTicket) return null;

                return {
                    ...prevTicket,
                    assignedTeam: teamId,
                    assignedUser: userId
                };
            });
        } catch (err) {
            setError('Failed to assign ticket. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEscalateTicket = async (
        ticketId: string,
        escalation: TicketEscalationFormData
    ) => {
        setIsSubmitting(true);

        try {
            await ticketService.escalateTicket(ticketId, escalation);

            // Update ticket with escalation info
            setTicket(prevTicket => {
                if (!prevTicket) return null;

                return {
                    ...prevTicket,
                    escalated: true,
                    escalationLevel: escalation.level,
                    escalationReason: escalation.reason,
                    ...(escalation.newAssignment ? {
                        assignedTeam: escalation.newAssignment.teamId,
                        assignedUser: escalation.newAssignment.userId
                    } : {})
                };
            });
        } catch (err) {
            setError('Failed to escalate ticket. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddComment = async (comment: { content: string; isInternal: boolean }) => {
        if (!id) return;

        setIsSubmitting(true);

        try {
            const newComment = await ticketService.createTicketComment(id, {
                content: comment.content,
                isInternal: comment.isInternal
            });

            // Add new comment to state
            setComments(prevComments => [newComment, ...prevComments]);
        } catch (err) {
            setError('Failed to add comment. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTicket = async (data: TicketFormData) => {
        if (!ticket || !id) return;

        setIsSubmitting(true);

        try {
            const updatedTicket = await ticketService.updateTicket(id, data);
            setTicket(updatedTicket);
            setShowEditModal(false);
        } catch (err) {
            setError('Failed to update ticket. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !ticket) {
        return (
            <>
                <div className="p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="h-64 bg-gray-200 rounded lg:col-span-2"></div>
                            <div className="h-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!ticket) {
        return (
            <>
                <div className="p-6">
                    <div className="text-center py-12">
                        <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Ticket Not Found</h3>
                        <p className="text-gray-500 mb-6">
                            The ticket you're looking for doesn't exist or has been deleted.
                        </p>
                        <Button
                            onClick={() => navigate('/support/tickets')}
                            leftIcon={<ChevronLeft size={16} />}
                        >
                            Back to Tickets
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-6 mt-6">
                    {error}
                </div>
            )}

            <div className="mb-6 mx-6 mt-6 flex justify-end">
                <Button
                    leftIcon={<Edit size={16} />}
                    onClick={() => setShowEditModal(true)}
                >
                    Edit Ticket
                </Button>
            </div>

            <TicketDetailPage
            // ticket={ticket}
            // comments={comments}
            // teams={teams}
            // onBack={() => navigate('/support/tickets')}
            // onAssign={handleAssignTicket}
            // onEscalate={handleEscalateTicket}
            // onAddComment={handleAddComment}
            // isLoading={isSubmitting}
            />

            {/* Edit Ticket Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Ticket"
            >
                <TicketForm
                    ticket={ticket}
                    onSubmit={handleUpdateTicket}
                    onCancel={() => setShowEditModal(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </>
    );
};

export default TicketDetailPage;