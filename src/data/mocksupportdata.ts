// data/mockSupportData.ts

import { User, Agent, Ticket, Message, SLAConfig, TicketCategory, CannedResponse, DashboardStats } from '../types/support';

// Mock Users
export const mockUsers: User[] = [
  { id: 'usr_1', name: 'John Kamau', email: 'john.kamau@example.com', accountType: 'premium', avatar: 'JK' },
  { id: 'usr_2', name: 'Mary Wanjiru', email: 'mary.wanjiru@example.com', accountType: 'basic', avatar: 'MW' },
  { id: 'usr_3', name: 'Peter Ochieng', email: 'peter.ochieng@example.com', accountType: 'premium', avatar: 'PO' },
  { id: 'usr_4', name: 'Grace Akinyi', email: 'grace.akinyi@example.com', accountType: 'basic', avatar: 'GA' },
  { id: 'usr_5', name: 'Samuel Mwangi', email: 'samuel.mwangi@example.com', accountType: 'business', avatar: 'SM' }
];

// Mock Agents
export const mockAgents: Agent[] = [
  {
    id: 'agt_1',
    name: 'Alice Njeri',
    email: 'alice.njeri@support.com',
    role: 'agent',
    status: 'online',
    assignedCategories: ['wallet', 'payments'],
    lastActive: new Date(),
    ticketsHandled: 127,
    avgResponseTime: 15,
    slaCompliance: 94.5
  },
  {
    id: 'agt_2',
    name: 'Brian Kiprop',
    email: 'brian.kiprop@support.com',
    role: 'supervisor',
    status: 'online',
    assignedCategories: ['all'],
    lastActive: new Date(),
    ticketsHandled: 89,
    avgResponseTime: 12,
    slaCompliance: 97.2
  },
  {
    id: 'agt_3',
    name: 'Caroline Muthoni',
    email: 'caroline.muthoni@support.com',
    role: 'agent',
    status: 'offline',
    assignedCategories: ['account', 'login'],
    lastActive: new Date(Date.now() - 3600000),
    ticketsHandled: 203,
    avgResponseTime: 18,
    slaCompliance: 91.8
  },
  {
    id: 'agt_4',
    name: 'David Otieno',
    email: 'david.otieno@support.com',
    role: 'admin',
    status: 'online',
    assignedCategories: ['all'],
    lastActive: new Date(),
    ticketsHandled: 45,
    avgResponseTime: 10,
    slaCompliance: 99.1
  }
];

// Mock Messages
const createMockMessages = (ticketId: string): Message[] => {
  const messages: Message[] = [
    {
      id: `msg_${ticketId}_1`,
      ticketId,
      senderId: 'usr_1',
      senderType: 'user',
      senderName: 'John Kamau',
      content: 'I cannot access my wallet. It shows an error when I try to log in.',
      timestamp: new Date(Date.now() - 7200000),
      attachments: []
    },
    {
      id: `msg_${ticketId}_2`,
      ticketId,
      senderId: 'agt_1',
      senderType: 'agent',
      senderName: 'Alice Njeri',
      content: 'Hello John, I understand you\'re having trouble accessing your wallet. Let me help you with that. Can you please tell me what error message you\'re seeing?',
      timestamp: new Date(Date.now() - 7000000),
      attachments: []
    },
    {
      id: `msg_${ticketId}_3`,
      ticketId,
      senderId: 'usr_1',
      senderType: 'user',
      senderName: 'John Kamau',
      content: 'It says "Invalid credentials" but I\'m sure my password is correct.',
      timestamp: new Date(Date.now() - 6800000),
      attachments: []
    }
  ];
  return messages;
};

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: 'tkt_001',
    subject: 'Cannot access wallet',
    description: 'Getting error when trying to log into wallet',
    category: 'wallet',
    priority: 'high',
    status: 'open',
    userId: 'usr_1',
    user: mockUsers[0],
    assignedAgentId: 'agt_1',
    assignedAgent: mockAgents[0],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    slaDeadline: new Date(Date.now() + 1800000),
    slaStatus: 'at-risk',
    messages: createMockMessages('tkt_001'),
    tags: ['login-issue', 'wallet'],
    unreadCount: 1
  },
  {
    id: 'tkt_002',
    subject: 'Payment failed but money deducted',
    category: 'payments',
    priority: 'critical',
    status: 'escalated',
    userId: 'usr_2',
    user: mockUsers[1],
    assignedAgentId: 'agt_2',
    assignedAgent: mockAgents[1],
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 1800000),
    slaDeadline: new Date(Date.now() - 600000),
    slaStatus: 'breached',
    escalationLevel: 1,
    messages: createMockMessages('tkt_002'),
    tags: ['payment-issue', 'refund'],
    unreadCount: 0
  },
  {
    id: 'tkt_003',
    subject: 'Account verification pending',
    category: 'account',
    priority: 'medium',
    status: 'pending',
    userId: 'usr_3',
    user: mockUsers[2],
    assignedAgentId: 'agt_3',
    assignedAgent: mockAgents[2],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
    slaDeadline: new Date(Date.now() + 86400000),
    slaStatus: 'compliant',
    messages: createMockMessages('tkt_003'),
    tags: ['kyc', 'verification'],
    unreadCount: 2
  },
  {
    id: 'tkt_004',
    subject: 'Unable to reset password',
    category: 'login',
    priority: 'medium',
    status: 'resolved',
    userId: 'usr_4',
    user: mockUsers[3],
    assignedAgentId: 'agt_1',
    assignedAgent: mockAgents[0],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    slaStatus: 'compliant',
    messages: createMockMessages('tkt_004'),
    tags: ['password-reset'],
    unreadCount: 0
  },
  {
    id: 'tkt_005',
    subject: 'Transaction limit exceeded',
    category: 'wallet',
    priority: 'low',
    status: 'open',
    userId: 'usr_5',
    user: mockUsers[4],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    slaDeadline: new Date(Date.now() + 82800000),
    slaStatus: 'compliant',
    messages: createMockMessages('tkt_005'),
    tags: ['limits'],
    unreadCount: 3
  }
];

// Mock SLA Configurations
export const mockSLAConfigs: SLAConfig[] = [
  {
    id: 'sla_1',
    priority: 'critical',
    category: 'payments',
    responseTimeSLA: 15, // 15 minutes
    resolutionTimeSLA: 120, // 2 hours
    escalationWindow: 10,
    status: 'active'
  },
  {
    id: 'sla_2',
    priority: 'high',
    category: 'wallet',
    responseTimeSLA: 30,
    resolutionTimeSLA: 240, // 4 hours
    escalationWindow: 20,
    status: 'active'
  },
  {
    id: 'sla_3',
    priority: 'medium',
    category: 'account',
    responseTimeSLA: 60,
    resolutionTimeSLA: 1440, // 24 hours
    escalationWindow: 45,
    status: 'active'
  },
  {
    id: 'sla_4',
    priority: 'low',
    category: 'general',
    responseTimeSLA: 120,
    resolutionTimeSLA: 2880, // 48 hours
    status: 'active'
  }
];

// Mock Categories
export const mockCategories: TicketCategory[] = [
  {
    id: 'cat_1',
    name: 'Wallet',
    defaultPriority: 'high',
    status: 'active',
    icon: '💰',
    color: '#3B82F6'
  },
  {
    id: 'cat_2',
    name: 'Payments',
    defaultPriority: 'critical',
    status: 'active',
    icon: '💳',
    color: '#EF4444'
  },
  {
    id: 'cat_3',
    name: 'Account',
    defaultPriority: 'medium',
    status: 'active',
    icon: '👤',
    color: '#10B981'
  },
  {
    id: 'cat_4',
    name: 'Login',
    defaultPriority: 'medium',
    status: 'active',
    icon: '🔐',
    color: '#F59E0B'
  },
  {
    id: 'cat_5',
    name: 'General',
    defaultPriority: 'low',
    status: 'active',
    icon: '📋',
    color: '#6B7280'
  }
];

// Mock Canned Responses
export const mockCannedResponses: CannedResponse[] = [
  {
    id: 'cr_1',
    title: 'Password Reset Instructions',
    content: 'To reset your password, please click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password.',
    categories: ['login', 'account'],
    createdBy: 'agt_4',
    createdAt: new Date(Date.now() - 864000000),
    status: 'active'
  },
  {
    id: 'cr_2',
    title: 'Payment Investigation',
    content: 'I understand your payment was deducted but the transaction failed. Let me investigate this for you. Can you please provide the transaction reference number and the exact time of the transaction?',
    categories: ['payments'],
    createdBy: 'agt_4',
    createdAt: new Date(Date.now() - 864000000),
    status: 'active'
  },
  {
    id: 'cr_3',
    title: 'KYC Verification Process',
    content: 'To complete your account verification, please ensure you have uploaded: 1) A clear photo of your ID, 2) A selfie holding your ID, 3) Proof of address. The verification process typically takes 24-48 hours.',
    categories: ['account'],
    createdBy: 'agt_4',
    createdAt: new Date(Date.now() - 864000000),
    status: 'active'
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  openTickets: 47,
  slaBreaches: 3,
  agentsOnline: 12,
  escalatedTickets: 5,
  ticketTrends: {
    created: [45, 52, 48, 61, 55, 49, 47],
    resolved: [42, 48, 51, 56, 52, 45, 44],
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  categoryDistribution: [
    { category: 'Wallet', count: 156, percentage: 35, color: '#3B82F6' },
    { category: 'Payments', count: 112, percentage: 25, color: '#EF4444' },
    { category: 'Account', count: 89, percentage: 20, color: '#10B981' },
    { category: 'Login', count: 67, percentage: 15, color: '#F59E0B' },
    { category: 'General', count: 22, percentage: 5, color: '#6B7280' }
  ],
  agentLeaderboard: [
    {
      agentId: 'agt_1',
      name: 'Alice Njeri',
      avatar: 'AN',
      ticketsHandled: 127,
      avgResolutionTime: 32,
      slaCompliance: 94.5
    },
    {
      agentId: 'agt_3',
      name: 'Caroline Muthoni',
      avatar: 'CM',
      ticketsHandled: 203,
      avgResolutionTime: 28,
      slaCompliance: 91.8
    },
    {
      agentId: 'agt_2',
      name: 'Brian Kiprop',
      avatar: 'BK',
      ticketsHandled: 89,
      avgResolutionTime: 25,
      slaCompliance: 97.2
    }
  ]
};