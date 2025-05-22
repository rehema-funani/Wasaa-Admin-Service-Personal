// Mock data for the support module
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'agent' | 'supervisor' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    lastActive?: string;
    assignedCategories?: string[];
    ticketsHandled?: number;
    avgResponseTime?: string;
    slaCompliance?: number;
    isOnline?: boolean;
  }
  
  export interface Ticket {
    id: string;
    subject: string;
    content: string;
    category: 'wallet' | 'login' | 'payments' | 'account' | 'technical' | 'billing';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'pending' | 'escalated' | 'resolved' | 'closed';
    userId: string;
    assignedAgentId?: string;
    createdAt: string;
    updatedAt: string;
    slaBreached: boolean;
    slaDeadline: string;
    escalationLevel?: number;
    tags: string[];
    messages: TicketMessage[];
    attachments?: string[];
  }
  
  export interface TicketMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderType: 'user' | 'agent' | 'system';
    content: string;
    timestamp: string;
    isInternal?: boolean;
    attachments?: string[];
  }
  
  export interface SLARule {
    id: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    responseTimeMinutes: number;
    resolutionTimeHours: number;
    escalationThresholdMinutes?: number;
    isActive: boolean;
  }
  
  export interface AuditLog {
    id: string;
    timestamp: string;
    actorId: string;
    actorRole: string;
    action: string;
    targetObject: string;
    targetId: string;
    description: string;
    ipAddress?: string;
  }
  
  // Mock Users
  export const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@wasaachat.com',
      role: 'admin',
      status: 'active',
      lastActive: '2024-01-20T10:30:00Z',
      isOnline: true,
      assignedCategories: ['all'],
      ticketsHandled: 150,
      avgResponseTime: '5m',
      slaCompliance: 98
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@wasaachat.com',
      role: 'supervisor',
      status: 'active',
      lastActive: '2024-01-20T09:45:00Z',
      isOnline: true,
      assignedCategories: ['wallet', 'payments', 'billing'],
      ticketsHandled: 89,
      avgResponseTime: '3m',
      slaCompliance: 95
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@wasaachat.com',
      role: 'agent',
      status: 'active',
      lastActive: '2024-01-20T11:15:00Z',
      isOnline: true,
      assignedCategories: ['wallet', 'account'],
      ticketsHandled: 67,
      avgResponseTime: '7m',
      slaCompliance: 92
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@wasaachat.com',
      role: 'agent',
      status: 'active',
      lastActive: '2024-01-20T08:20:00Z',
      isOnline: false,
      assignedCategories: ['login', 'technical'],
      ticketsHandled: 45,
      avgResponseTime: '12m',
      slaCompliance: 88
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@wasaachat.com',
      role: 'agent',
      status: 'active',
      lastActive: '2024-01-20T10:00:00Z',
      isOnline: true,
      assignedCategories: ['payments', 'billing'],
      ticketsHandled: 73,
      avgResponseTime: '4m',
      slaCompliance: 96
    },
    // Mock regular users
    {
      id: 'u1',
      name: 'Alice Cooper',
      email: 'alice.cooper@example.com',
      role: 'user',
      status: 'active'
    },
    {
      id: 'u2',
      name: 'Bob Martinez',
      email: 'bob.martinez@example.com',
      role: 'user',
      status: 'active'
    },
    {
      id: 'u3',
      name: 'Carol White',
      email: 'carol.white@example.com',
      role: 'user',
      status: 'active'
    }
  ];
  
  // Mock Tickets
  export const mockTickets: Ticket[] = [
    {
      id: 'TKT-001',
      subject: 'Cannot access my wallet balance',
      content: 'I\'ve been trying to check my wallet balance for the past hour but the app keeps showing an error message.',
      category: 'wallet',
      priority: 'high',
      status: 'open',
      userId: 'u1',
      assignedAgentId: '3',
      createdAt: '2024-01-20T09:30:00Z',
      updatedAt: '2024-01-20T10:45:00Z',
      slaBreached: false,
      slaDeadline: '2024-01-20T13:30:00Z',
      tags: ['balance', 'error'],
      messages: [
        {
          id: 'm1',
          ticketId: 'TKT-001',
          senderId: 'u1',
          senderType: 'user',
          content: 'I\'ve been trying to check my wallet balance for the past hour but the app keeps showing an error message.',
          timestamp: '2024-01-20T09:30:00Z'
        },
        {
          id: 'm2',
          ticketId: 'TKT-001',
          senderId: '3',
          senderType: 'agent',
          content: 'Hi Alice! I\'m sorry to hear you\'re having trouble accessing your wallet balance. Let me help you with this issue. Can you please tell me what error message you\'re seeing?',
          timestamp: '2024-01-20T10:45:00Z'
        }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Payment failed but money was deducted',
      content: 'I tried to pay for my electricity bill but the payment failed. However, the money was still deducted from my account.',
      category: 'payments',
      priority: 'critical',
      status: 'escalated',
      userId: 'u2',
      assignedAgentId: '5',
      createdAt: '2024-01-19T14:20:00Z',
      updatedAt: '2024-01-20T08:15:00Z',
      slaBreached: true,
      slaDeadline: '2024-01-19T18:20:00Z',
      escalationLevel: 1,
      tags: ['payment', 'deduction', 'electricity'],
      messages: [
        {
          id: 'm3',
          ticketId: 'TKT-002',
          senderId: 'u2',
          senderType: 'user',
          content: 'I tried to pay for my electricity bill but the payment failed. However, the money was still deducted from my account.',
          timestamp: '2024-01-19T14:20:00Z'
        },
        {
          id: 'm4',
          ticketId: 'TKT-002',
          senderId: '5',
          senderType: 'agent',
          content: 'I understand your concern, Bob. This is definitely something we need to resolve immediately. I\'m escalating this to our payments team for investigation.',
          timestamp: '2024-01-20T08:15:00Z'
        }
      ]
    },
    {
      id: 'TKT-003',
      subject: 'Forgot my login password',
      content: 'I forgot my password and the reset email is not coming through. Please help me reset it.',
      category: 'login',
      priority: 'medium',
      status: 'resolved',
      userId: 'u3',
      assignedAgentId: '4',
      createdAt: '2024-01-19T16:45:00Z',
      updatedAt: '2024-01-20T09:30:00Z',
      slaBreached: false,
      slaDeadline: '2024-01-20T16:45:00Z',
      tags: ['password', 'reset', 'email'],
      messages: [
        {
          id: 'm5',
          ticketId: 'TKT-003',
          senderId: 'u3',
          senderType: 'user',
          content: 'I forgot my password and the reset email is not coming through. Please help me reset it.',
          timestamp: '2024-01-19T16:45:00Z'
        },
        {
          id: 'm6',
          ticketId: 'TKT-003',
          senderId: '4',
          senderType: 'agent',
          content: 'Hi Carol! I\'ve manually triggered a password reset for your account. Please check your email (including spam folder) in the next few minutes.',
          timestamp: '2024-01-20T09:30:00Z'
        }
      ]
    },
    {
      id: 'TKT-004',
      subject: 'Account verification pending for 3 days',
      content: 'I submitted my documents for account verification 3 days ago but it\'s still pending. When will it be processed?',
      category: 'account',
      priority: 'high',
      status: 'pending',
      userId: 'u1',
      assignedAgentId: '3',
      createdAt: '2024-01-17T11:20:00Z',
      updatedAt: '2024-01-20T07:45:00Z',
      slaBreached: true,
      slaDeadline: '2024-01-18T11:20:00Z',
      tags: ['verification', 'documents', 'kyc'],
      messages: [
        {
          id: 'm7',
          ticketId: 'TKT-004',
          senderId: 'u1',
          senderType: 'user',
          content: 'I submitted my documents for account verification 3 days ago but it\'s still pending. When will it be processed?',
          timestamp: '2024-01-17T11:20:00Z'
        }
      ]
    },
    {
      id: 'TKT-005',
      subject: 'App crashes when opening transactions',
      content: 'Every time I try to open the transactions page, the app crashes immediately. This started happening after the latest update.',
      category: 'technical',
      priority: 'medium',
      status: 'open',
      userId: 'u2',
      assignedAgentId: '4',
      createdAt: '2024-01-20T08:15:00Z',
      updatedAt: '2024-01-20T08:15:00Z',
      slaBreached: false,
      slaDeadline: '2024-01-21T08:15:00Z',
      tags: ['crash', 'transactions', 'update'],
      messages: [
        {
          id: 'm8',
          ticketId: 'TKT-005',
          senderId: 'u2',
          senderType: 'user',
          content: 'Every time I try to open the transactions page, the app crashes immediately. This started happening after the latest update.',
          timestamp: '2024-01-20T08:15:00Z'
        }
      ]
    },
    {
      id: 'TKT-006',
      subject: 'Incorrect billing amount charged',
      content: 'I was charged $50 for premium features but I only signed up for the basic plan at $20. Please check and refund the difference.',
      category: 'billing',
      priority: 'high',
      status: 'open',
      userId: 'u3',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      slaBreached: false,
      slaDeadline: '2024-01-20T14:00:00Z',
      tags: ['billing', 'refund', 'premium'],
      messages: [
        {
          id: 'm9',
          ticketId: 'TKT-006',
          senderId: 'u3',
          senderType: 'user',
          content: 'I was charged $50 for premium features but I only signed up for the basic plan at $20. Please check and refund the difference.',
          timestamp: '2024-01-20T10:00:00Z'
        }
      ]
    }
  ];
  
  // Mock SLA Rules
  export const mockSLARules: SLARule[] = [
    {
      id: 'sla-1',
      priority: 'critical',
      category: 'all',
      responseTimeMinutes: 15,
      resolutionTimeHours: 4,
      escalationThresholdMinutes: 30,
      isActive: true
    },
    {
      id: 'sla-2',
      priority: 'high',
      category: 'all',
      responseTimeMinutes: 60,
      resolutionTimeHours: 8,
      escalationThresholdMinutes: 120,
      isActive: true
    },
    {
      id: 'sla-3',
      priority: 'medium',
      category: 'all',
      responseTimeMinutes: 240,
      resolutionTimeHours: 24,
      escalationThresholdMinutes: 480,
      isActive: true
    },
    {
      id: 'sla-4',
      priority: 'low',
      category: 'all',
      responseTimeMinutes: 480,
      resolutionTimeHours: 72,
      isActive: true
    }
  ];
  
  // Mock Audit Logs
  export const mockAuditLogs: AuditLog[] = [
    {
      id: 'log-1',
      timestamp: '2024-01-20T11:30:00Z',
      actorId: '3',
      actorRole: 'agent',
      action: 'replied_to_ticket',
      targetObject: 'ticket',
      targetId: 'TKT-001',
      description: 'Mike Chen replied to ticket TKT-001',
      ipAddress: '192.168.1.100'
    },
    {
      id: 'log-2',
      timestamp: '2024-01-20T10:15:00Z',
      actorId: '2',
      actorRole: 'supervisor',
      action: 'assigned_ticket',
      targetObject: 'ticket',
      targetId: 'TKT-006',
      description: 'Sarah Johnson assigned ticket TKT-006 to David Wilson',
      ipAddress: '192.168.1.101'
    },
    {
      id: 'log-3',
      timestamp: '2024-01-20T09:45:00Z',
      actorId: '5',
      actorRole: 'agent',
      action: 'escalated_ticket',
      targetObject: 'ticket',
      targetId: 'TKT-002',
      description: 'David Wilson escalated ticket TKT-002 to supervisor',
      ipAddress: '192.168.1.102'
    },
    {
      id: 'log-4',
      timestamp: '2024-01-20T08:30:00Z',
      actorId: '1',
      actorRole: 'admin',
      action: 'updated_sla_rule',
      targetObject: 'sla_rule',
      targetId: 'sla-1',
      description: 'John Smith updated SLA rule for critical priority',
      ipAddress: '192.168.1.103'
    }
  ];
  
  // Utility functions
  export const getUser = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
  };
  
  export const getTicketsByAgent = (agentId: string): Ticket[] => {
    return mockTickets.filter(ticket => ticket.assignedAgentId === agentId);
  };
  
  export const getTicketsByStatus = (status: string): Ticket[] => {
    return mockTickets.filter(ticket => ticket.status === status);
  };
  
  export const getSLABreachedTickets = (): Ticket[] => {
    return mockTickets.filter(ticket => ticket.slaBreached);
  };
  
  export const getEscalatedTickets = (): Ticket[] => {
    return mockTickets.filter(ticket => ticket.status === 'escalated');
  };
  
  export const getOpenTicketsCount = (): number => {
    return mockTickets.filter(ticket => ticket.status === 'open').length;
  };
  
  export const getAgentsOnline = (): number => {
    return mockUsers.filter(user => user.role === 'agent' && user.isOnline).length;
  };
  
  export const categorizeTickets = () => {
    const categories = mockTickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / mockTickets.length) * 100)
    }));
  };
  
  // Current user context (for demo purposes)
  export const currentUser: User = mockUsers[0]; // Admin user