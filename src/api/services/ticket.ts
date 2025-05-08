import { 
  Ticket, 
  TicketFormData, 
  TicketComment, 
  TicketCommentFormData,
  TicketAssignment,
  TicketEscalation, 
  TicketEscalationFormData 
} from '../../types/team';
import { supportaxios } from '../support-axios';

export const ticketService = {
  getTickets: async (params?: Record<string, any>): Promise<Ticket[]> => {
    const response = await supportaxios.get('/tickets', { params });
    return response.data;
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const response = await supportaxios.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticket: TicketFormData): Promise<Ticket> => {
    const response = await supportaxios.post('/tickets', ticket);
    return response.data;
  },

  updateTicket: async (id: string, ticket: Partial<TicketFormData>): Promise<Ticket> => {
    const response = await supportaxios.put(`/tickets/${id}`, ticket);
    return response.data;
  },

  deleteTicket: async (id: string): Promise<void> => {
    await supportaxios.delete(`/tickets/${id}`);
  },

  assignTicketToTeam: async (
    ticketId: any,
    teamId: any,
  ): Promise<TicketAssignment> => {
    const response = await supportaxios.get(`/tickets/${ticketId}/assign-team/${teamId}`);
    return response.data;
  },

  assignTicketToUser: async (
    ticketId: string,
    userId: string,
  ): Promise<TicketAssignment> => {
    const response = await supportaxios.get(`/tickets/${ticketId}/assign-user/${userId}`);
    return response.data;
  },

  getTicketAssignments: async (params?: Record<string, any>): Promise<TicketAssignment[]> => {
    const response = await supportaxios.get('/ticket-assignments', { params });
    return response.data;
  },

  deleteTicketAssignment: async (assignmentId: string): Promise<void> => {
    await supportaxios.delete(`/assignments/${assignmentId}`);
  },

  escalateTicket: async (
    ticketId: string,
    escalation: any
  ): Promise<any> => {
    const response = await supportaxios.put(`/tickets/${ticketId}/escalate`, escalation);
    return response.data;
  },

  getTicketEscalations: async (ticketId: string): Promise<TicketEscalation[]> => {
    const response = await supportaxios.get(`/tickets/${ticketId}/escalations`);
    return response.data;
  },

  getTicketComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await supportaxios.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  createTicketComment: async (
    ticketId: string,
    data: any
  ): Promise<TicketComment> => {
    const response = await supportaxios.post(`/tickets/${ticketId}/comments`, data);
    return response.data;
  },

  updateTicketComment: async (
    ticketId: string,
    commentId: string,
    comment: TicketCommentFormData
  ): Promise<TicketComment> => {
    const response = await supportaxios.put(`/tickets/${ticketId}/comments/${commentId}`, comment);
    return response.data;
  },

  deleteTicketComment: async (ticketId: string, commentId: string): Promise<void> => {
    await supportaxios.delete(`/tickets/${ticketId}/comments/${commentId}`);
  }
};