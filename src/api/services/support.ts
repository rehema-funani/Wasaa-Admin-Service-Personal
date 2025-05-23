import { 
    Ticket, 
    Agent, 
    SLAConfig, 
    TicketCategory, 
    CannedResponse,
    DashboardStats,
    Message 
  } from '../../types/support';
  import { 
    mockTickets, 
    mockAgents, 
    mockSLAConfigs, 
    mockCategories, 
    mockCannedResponses,
    mockDashboardStats 
  } from '../../data/mocksupportdata';
  
  // Simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  class MockSupportService {
    private tickets: Ticket[] = [...mockTickets];
    private agents: Agent[] = [...mockAgents];
    private slaConfigs: SLAConfig[] = [...mockSLAConfigs];
    private categories: TicketCategory[] = [...mockCategories];
    private cannedResponses: CannedResponse[] = [...mockCannedResponses];
  
    // Ticket Management
    async getTickets(filters?: {
      status?: string;
      category?: string;
      assignedAgent?: string;
      slaStatus?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) {
      await delay(500);
      
      let filteredTickets = [...this.tickets];
      
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          filteredTickets = filteredTickets.filter(t => t.status === filters.status);
        }
        if (filters.category) {
          filteredTickets = filteredTickets.filter(t => t.category === filters.category);
        }
        if (filters.assignedAgent) {
          filteredTickets = filteredTickets.filter(t => t.assignedAgentId === filters.assignedAgent);
        }
        if (filters.slaStatus) {
          filteredTickets = filteredTickets.filter(t => t.slaStatus === filters.slaStatus);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filteredTickets = filteredTickets.filter(t => 
            t.subject.toLowerCase().includes(search) ||
            t.id.toLowerCase().includes(search) ||
            t.user?.name.toLowerCase().includes(search) ||
            t.user?.email.toLowerCase().includes(search)
          );
        }
      }
      
      // Sort by creation date (newest first)
      filteredTickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const start = (page - 1) * limit;
      const paginatedTickets = filteredTickets.slice(start, start + limit);
      
      return {
        tickets: paginatedTickets,
        total: filteredTickets.length,
        page,
        limit
      };
    }
  
    async getTicketById(id: string) {
      const ticket = this.tickets.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket not found');
      return ticket;
    }
  
    async createTicket(data: Partial<Ticket>) {
      await delay(400);
      const newTicket: Ticket = {
        id: `tkt_${Date.now()}`,
        subject: data.subject || '',
        description: data.description,
        category: data.category || 'general',
        priority: data.priority || 'medium',
        status: 'open',
        userId: data.userId || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        tags: data.tags || [],
        unreadCount: 0
      };
      this.tickets.unshift(newTicket);
      return newTicket;
    }
  
    async updateTicket(id: string, data: Partial<Ticket>) {
      await delay(300);
      const index = this.tickets.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Ticket not found');
      
      this.tickets[index] = {
        ...this.tickets[index],
        ...data,
        updatedAt: new Date()
      };
      return this.tickets[index];
    }
  
    async sendMessage(ticketId: string, message: { content: string; senderId: string; senderType: 'user' | 'agent' }) {
      await delay(400);
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) throw new Error('Ticket not found');
      
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        ticketId,
        senderId: message.senderId,
        senderType: message.senderType,
        content: message.content,
        timestamp: new Date(),
        attachments: []
      };
      
      ticket.messages.push(newMessage);
      ticket.updatedAt = new Date();
      
      return newMessage;
    }
  
    async bulkUpdateTickets(ticketIds: string[], updates: Partial<Ticket>) {
      await delay(600);
      const updatedTickets: Ticket[] = [];
      
      ticketIds.forEach(id => {
        const index = this.tickets.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tickets[index] = {
            ...this.tickets[index],
            ...updates,
            updatedAt: new Date()
          };
          updatedTickets.push(this.tickets[index]);
        }
      });
      
      return updatedTickets;
    }
  
    // Agent Management
    async getAgents(filters?: {
      role?: string;
      status?: string;
      category?: string;
      search?: string;
    }) {
      await delay(400);
      
      let filteredAgents = [...this.agents];
      
      if (filters) {
        if (filters.role) {
          filteredAgents = filteredAgents.filter(a => a.role === filters.role);
        }
        if (filters.status) {
          filteredAgents = filteredAgents.filter(a => a.status === filters.status);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filteredAgents = filteredAgents.filter(a => 
            a.name.toLowerCase().includes(search) ||
            a.email.toLowerCase().includes(search)
          );
        }
      }
      
      return filteredAgents;
    }
  
    async getAgentById(id: string) {
      await delay(300);
      const agent = this.agents.find(a => a.id === id);
      if (!agent) throw new Error('Agent not found');
      return agent;
    }
  
    async updateAgent(id: string, data: Partial<Agent>) {
      await delay(400);
      const index = this.agents.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Agent not found');
      
      this.agents[index] = {
        ...this.agents[index],
        ...data
      };
      return this.agents[index];
    }
  
    // SLA Management
    async getSLAConfigs() {
      await delay(300);
      return [...this.slaConfigs];
    }
  
    async createSLAConfig(data: Partial<SLAConfig>) {
      await delay(400);
      const newConfig: SLAConfig = {
        id: `sla_${Date.now()}`,
        priority: data.priority || 'medium',
        category: data.category || 'general',
        responseTimeSLA: data.responseTimeSLA || 60,
        resolutionTimeSLA: data.resolutionTimeSLA || 1440,
        escalationWindow: data.escalationWindow,
        status: data.status || 'active'
      };
      this.slaConfigs.push(newConfig);
      return newConfig;
    }
  
    async updateSLAConfig(id: string, data: Partial<SLAConfig>) {
      await delay(400);
      const index = this.slaConfigs.findIndex(s => s.id === id);
      if (index === -1) throw new Error('SLA config not found');
      
      this.slaConfigs[index] = {
        ...this.slaConfigs[index],
        ...data
      };
      return this.slaConfigs[index];
    }
  
    async deleteSLAConfig(id: string) {
      await delay(400);
      const index = this.slaConfigs.findIndex(s => s.id === id);
      if (index === -1) throw new Error('SLA config not found');
      
      this.slaConfigs.splice(index, 1);
      return { success: true };
    }
  
    // Categories
    async getCategories() {
      await delay(300);
      return [...this.categories];
    }
  
    async createCategory(data: Partial<TicketCategory>) {
      await delay(400);
      const newCategory: TicketCategory = {
        id: `cat_${Date.now()}`,
        name: data.name || '',
        defaultPriority: data.defaultPriority || 'medium',
        status: data.status || 'active',
        icon: data.icon,
        color: data.color
      };
      this.categories.push(newCategory);
      return newCategory;
    }
  
    async updateCategory(id: string, data: Partial<TicketCategory>) {
      await delay(400);
      const index = this.categories.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Category not found');
      
      this.categories[index] = {
        ...this.categories[index],
        ...data
      };
      return this.categories[index];
    }
  
    // Canned Responses
    async getCannedResponses(category?: string) {
      await delay(300);
      let filtered = [...this.cannedResponses];
      
      if (category) {
        filtered = filtered.filter(cr => cr.categories.includes(category));
      }
      
      return filtered;
    }
  
    async createCannedResponse(data: Partial<CannedResponse>) {
      await delay(400);
      const newResponse: CannedResponse = {
        id: `cr_${Date.now()}`,
        title: data.title || '',
        content: data.content || '',
        categories: data.categories || [],
        createdBy: data.createdBy || '',
        createdAt: new Date(),
        status: data.status || 'active'
      };
      this.cannedResponses.push(newResponse);
      return newResponse;
    }
  
    // Analytics
    async getDashboardStats() {
      await delay(500);
      return { ...mockDashboardStats };
    }
  
    async getAgentPerformance(agentId?: string, dateRange?: { start: Date; end: Date }) {
      await delay(400);
      // Return mock performance data
      return {
        agentId,
        dateRange,
        ticketsHandled: 45,
        avgResponseTime: 15,
        avgResolutionTime: 120,
        slaCompliance: 95.5,
        customerSatisfaction: 4.2
      };
    }
  }
  
  export default new MockSupportService();