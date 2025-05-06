// pages/support/tickets/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketFormData } from '../../../types/team';
import { ticketService } from '../../../api/services/ticket';
import { TicketList } from '../../../components/tickets/TicketList';
import { TicketForm } from '../../../components/tickets/TicketForm';
import { Modal } from '../../../components/common/Modal';

const TicketsIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch tickets on component mount
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchedTickets = await ticketService.getTickets();
            setTickets(fetchedTickets.tickets);
        } catch (err) {
            setError('Failed to fetch tickets. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTicket = () => {
        setShowAddModal(true);
    };

    const handleViewTicket = (id: string) => {
        navigate(`/support/tickets/${id}`);
    };

    const handleCreateTicket = async (data: TicketFormData) => {
        setIsSubmitting(true);

        try {
            const newTicket = await ticketService.createTicket(data);
            setTickets(prevTickets => [newTicket, ...prevTickets]);
            setShowAddModal(false);
        } catch (err) {
            setError('Failed to create ticket. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-6">
                    {error}
                </div>
            )}

            <TicketList
                tickets={tickets}
                isLoading={isLoading}
                onAddTicket={handleAddTicket}
                onViewTicket={handleViewTicket}
            />

            {/* Add Ticket Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Create New Ticket"
            >
                <TicketForm
                    onSubmit={handleCreateTicket}
                    onCancel={() => setShowAddModal(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </>
    );
};

export default TicketsIndexPage;