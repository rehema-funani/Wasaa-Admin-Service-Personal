import supportaxios from "../support-axios";

const supportService = {

  // ======= HEALTH CHECK =======
  healthCheck: async () => {
    const response = await supportaxios.get('/health');
    return response.data;
  },

  //  ======= TICKETS =======
  createTicket: async (ticketData: any) => {
    const response = await supportaxios.post('/tickets', ticketData);
    return response.data;
  },

  getTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    search?: string;
  }) => {
    const response = await supportaxios.get('/tickets', { params });
    return response.data;
  },

  getTicketById: async (id: string) => {
    const response = await supportaxios.get(`/tickets/${id}`);
    return response.data;
  },

  getTicketByNumber: async (ticketNumber: any) => {
    const response = await supportaxios.get(`/tickets/number/${ticketNumber}`);
    return response.data;
  },

  assignTicket: async (id: string, userId: string) => {
    const response = await supportaxios.patch(`/tickets/${id}/assign`, { userId });
    return response.data;
  },

  escalateTicket: async (id: string, escalationData: any) => {
    const response = await supportaxios.patch(`/tickets/${id}/escalate`, escalationData);
    return response.data;
  },

  updateTicket: async (id: string, ticketData: any) => {
    const response = await supportaxios.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  deleteTicket: async (id: string) => {
    const response = await supportaxios.delete(`/tickets/${id}`);
    return response.data;
  },

  createMessage: async (ticketId: string, messageData: any) => {
    const response = await supportaxios.post(`/tickets/${ticketId}/messages`, messageData);
    return response.data;
  },

  getTicketMessages: async (ticketId: string) => {
    const response = await supportaxios.get(`/tickets/${ticketId}/messages`);
    return response.data;
  },

  resolveTicket: async (id: string, resolutionData: any) => {
    const response = await supportaxios.patch(`/tickets/${id}/resolve`, resolutionData);
    return response.data;
  },

  closeTicket: async (id: string) => {
    const response = await supportaxios.patch(`/tickets/${id}/close`);
    return response.data;
  },

getTicketStats: async (params?: {
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await supportaxios.get('/tickets/statistics');
    return response.data;
  },

  //  ======= USERS =======
  createUser: async (userData: any) => {
    const response = await supportaxios.post('/users', userData);
    return response.data;
  },

  getUsers: async () => {
    const response = await supportaxios.get('/users');
    return response.data;
  },

  getOnlineAgents: async () => {
    const response = await supportaxios.get('/users/agents/online');
    return response.data;
  },

  getAgentPerformance: async (id: string, params?: {
    period?: string;
  }) => {
    const response = await supportaxios.get(`/users/${id}/performance`, { params });
    return response.data;
  },

  updateUserAgentStatus: async (id: string, status: string) => {
    const response = await supportaxios.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await supportaxios.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  // ======= SLA ========
  createSLARule: async (slaData: any) => {
    const response = await supportaxios.post('/sla', slaData);
    return response.data;
  },

  getSLARules: async (params?: {
    includeInactive?: boolean;
  }) => {
    const response = await supportaxios.get('/sla', { params });
    return response.data;
  },

  getSLAMetrics: async (params?: {
    period?: string;
  }) => {
    const response = await supportaxios.get('/sla/metrics', { params });
    return response.data;
  },

  processExpiredTickets: async () => {
    const response = await supportaxios.post('/sla/process-expired');
    return response.data;
  },

  getSLARuleById: async (id: string) => {
    const response = await supportaxios.get(`/sla/${id}`);
    return response.data;
  },

  updateSLARule: async (id: string, slaData: any) => {
    const response = await supportaxios.put(`/sla/${id}`, slaData);
    return response.data;
  },

  deleteSLARule: async (id: string) => {
    const response = await supportaxios.delete(`/sla/${id}`);
    return response.data;
  },

  // ======== CATEGORIES =======
  createCategory: async (categoryData: any) => {
    const response = await supportaxios.post('/categories', categoryData);
    return response.data;
  },

  getCategories: async () => {
    const response = await supportaxios.get('/categories');
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await supportaxios.get(`/categories/${id}`);
    return response.data;
  },

  updateCategory: async (id: string, categoryData: any) => {
    const response = await supportaxios.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await supportaxios.delete(`/categories/${id}`);
    return response.data;
  },

  // ======== AGENTS =======
  createAgent: async (agentData: any) => {
    const response = await supportaxios.post('/agents', agentData);
    return response.data;
  },

  getAgents: async () => {
    const response = await supportaxios.get('/agents');
    return response.data;
  },

  getAgentById: async (id: string) => {
    const response = await supportaxios.get(`/agents/${id}`);
    return response.data;
  },

  updateAgent: async (id: string, agentData: any) => {
    const response = await supportaxios.put(`/agents/${id}`, agentData);
    return response.data;
  },

  updateAgentStatus: async (id: string, status: string) => {
    const response = await supportaxios.patch(`/agents/${id}/status`, { status });
    return response.data;
  },

  getAgentStatistics: async (id: string) => {
    const response = await supportaxios.get(`/agents/${id}/statistics`);
    return response.data;
  },

  deleteAgent: async (id: string) => {
    const response = await supportaxios.delete(`/agents/${id}`);
    return response.data;
  },

  // ======== CANNED RESPONSES =======
  createCannedResponse: async (responseData: any) => {
    const response = await supportaxios.post('/canned-responses', responseData);
    return response.data;
  },

  getCannedResponses: async () => {
    const response = await supportaxios.get('/canned-responses');
    return response.data;
  },

  getCannedResponseById: async (id: string) => {
    const response = await supportaxios.get(`/canned-responses/${id}`);
    return response.data;
  },

  updateCannedResponse: async (id: string, responseData: any) => {
    const response = await supportaxios.patch(`/canned-responses/${id}`, responseData);
    return response.data;
  },

  deleteCannedResponse: async (id: string) => {
    const response = await supportaxios.delete(`/canned-responses/${id}`);
    return response.data;
  },

  getPopularTags: async () => {
    const response = await supportaxios.get('/tickets/tags/popular');
    return response.data;
  },

  renderCannedResponseTemplate: async (templateData: any, id: string) => {
    const response = await supportaxios.post(`/canned-responses/${id}/render`, templateData);
    return response.data;
  },
};

export default supportService;
