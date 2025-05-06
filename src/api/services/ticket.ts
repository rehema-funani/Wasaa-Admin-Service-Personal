// api/services/ticketService.ts
import { 
  Ticket, 
  TicketFormData, 
  TicketComment, 
  TicketCommentFormData,
  TicketAssignment,
  TicketEscalation, 
  TicketEscalationFormData 
} from '../../types/team';
import { api } from '../axios';

export const ticketService = {
  getTickets: async (params?: Record<string, any>): Promise<Ticket[]> => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticket: TicketFormData): Promise<Ticket> => {
    const response = await api.post('/tickets', ticket);
    return response.data;
  },

  updateTicket: async (id: string, ticket: Partial<TicketFormData>): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}`, ticket);
    return response.data;
  },

  deleteTicket: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  // Ticket Assignments
  assignTicket: async (
    ticketId: string, 
    assignment: { teamId?: string; userId?: string }
  ): Promise<TicketAssignment> => {
    const response = await api.post(`/tickets/${ticketId}/assign`, assignment);
    return response.data;
  },

  getTicketAssignments: async (params?: Record<string, any>): Promise<TicketAssignment[]> => {
    const response = await api.get('/assignments', { params });
    return response.data;
  },

  deleteTicketAssignment: async (assignmentId: string): Promise<void> => {
    await api.delete(`/assignments/${assignmentId}`);
  },

  // Ticket Escalations
  escalateTicket: async (
    ticketId: string,
    escalation: TicketEscalationFormData
  ): Promise<TicketEscalation> => {
    const response = await api.post(`/tickets/${ticketId}/escalate`, escalation);
    return response.data;
  },

  getTicketEscalations: async (ticketId: string): Promise<TicketEscalation[]> => {
    const response = await api.get(`/tickets/${ticketId}/escalations`);
    return response.data;
  },

  // Ticket Comments
  getTicketComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  createTicketComment: async (
    ticketId: string, 
    comment: TicketCommentFormData
  ): Promise<TicketComment> => {
    const response = await api.post(`/tickets/${ticketId}/comments`, comment);
    return response.data;
  },

  updateTicketComment: async (
    ticketId: string,
    commentId: string,
    comment: TicketCommentFormData
  ): Promise<TicketComment> => {
    const response = await api.put(`/tickets/${ticketId}/comments/${commentId}`, comment);
    return response.data;
  },

  deleteTicketComment: async (ticketId: string, commentId: string): Promise<void> => {
    await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
  }
};