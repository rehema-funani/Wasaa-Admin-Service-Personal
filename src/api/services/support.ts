import { api } from "../axios";

export const supportService = {

  //  ======= TICKETS =======
  getTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    search?: string;
  }) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  getTicketMetricsOverview: async () => {
    const response = await api.get('/tickets/metrics/overview');
    return response.data;
  },

  getTicketById: async (id: string) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  assignTicket: async (id: string, userId: string) => {
    const response = await api.patch(`/tickets/${id}/assign`, { userId });
    return response.data;
  },

  escalateTicket: async (id: string, escalationData: any) => {
    const response = await api.patch(`/tickets/${id}/escalate`, escalationData);
    return response.data;
  },

  updateTicket: async (id: string, ticketData: any) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  deleteTicket: async (id: string) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  createMessage: async (ticketId: string, messageData: any) => {
    const response = await api.post(`/tickets/${ticketId}/messages`, messageData);
    return response.data;
  },

  getTicketMessages: async (ticketId: string) => {
    const response = await api.get(`/tickets/${ticketId}/messages`);
    return response.data;
  },

  //  ======= USERS =======
  createUser: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getOnlineAgents: async () => {
    const response = await api.get('/users/agents/online');
    return response.data;
  },

  getAgentPerformance: async (id: string, params?: {
    period?: string;
  }) => {
    const response = await api.get(`/users/${id}/performance`, { params });
    return response.data;
  },

  updateUserAgentStatus: async (id: string, status: string) => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  // ======= SLA ========
  createSLARule: async (slaData: any) => {
    const response = await api.post('/sla', slaData);
    return response.data;
  },

  getSLARules: async (params?: {
    includeInactive?: boolean;
  }) => {
    const response = await api.get('/sla', { params });
    return response.data;
  },

  getSLAMetrics: async (params?: {
    period?: string;
  }) => {
    const response = await api.get('/sla/metrics', { params });
    return response.data;
  },

  processExpiredTickets: async () => {
    const response = await api.post('/sla/process-expired');
    return response.data;
  },

  getSLARuleById: async (id: string) => {
    const response = await api.get(`/sla/${id}`);
    return response.data;
  },

  updateSLARule: async (id: string, slaData: any) => {
    const response = await api.put(`/sla/${id}`, slaData);
    return response.data;
  },

  deleteSLARule: async (id: string) => {
    const response = await api.delete(`/sla/${id}`);
    return response.data;
  },

  // ======== CATEGORIES =======
  createCategory: async (categoryData: any) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  updateCategory: async (id: string, categoryData: any) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // ======== CANNED RESPONSES =======
  createCannedResponse: async (responseData: any) => {
    const response = await api.post('/canned-responses', responseData);
    return response.data;
  },

  getCannedResponses: async () => {
    const response = await api.get('/canned-responses');
    return response.data;
  },

  getCannedResponseById: async (id: string) => {
    const response = await api.get(`/canned-responses/${id}`);
    return response.data;
  },

  updateCannedResponse: async (id: string, responseData: any) => {
    const response = await api.patch(`/canned-responses/${id}`, responseData);
    return response.data;
  },

  deleteCannedResponse: async (id: string) => {
    const response = await api.delete(`/canned-responses/${id}`);
    return response.data;
  },

  getPopularTags: async () => {
    const response = await api.get('/tickets/tags/popular');
    return response.data;
  },
};
