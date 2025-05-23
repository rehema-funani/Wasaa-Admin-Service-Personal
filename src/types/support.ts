export interface User {
  id: string;
  name: string;
  email: string;
  accountType?: string;
  avatar?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'admin';
  status: 'online' | 'offline' | 'suspended' | 'inactive';
  assignedCategories: string[];
  lastActive?: Date;
  ticketsHandled?: number;
  avgResponseTime?: number;
  slaCompliance?: number;
}

export interface Ticket {
  id: string;
  subject: string;
  description?: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'pending' | 'resolved' | 'escalated' | 'closed';
  userId: string;
  user?: User;
  assignedAgentId?: string;
  assignedAgent?: Agent;
  createdAt: Date;
  updatedAt: Date;
  slaDeadline?: Date;
  slaStatus?: 'compliant' | 'at-risk' | 'breached';
  escalationLevel?: number;
  messages: Message[];
  tags?: string[];
  unreadCount?: number;
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'agent' | 'system';
  senderName?: string;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  isInternal?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface SLAConfig {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  responseTimeSLA: number; // in minutes
  resolutionTimeSLA: number; // in minutes
  escalationWindow?: number; // in minutes
  status: 'active' | 'inactive';
}

export interface TicketCategory {
  id: string;
  name: string;
  defaultPriority: 'critical' | 'high' | 'medium' | 'low';
  routingRule?: string;
  status: 'active' | 'archived';
  icon?: string;
  color?: string;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdBy: string;
  createdAt: Date;
  status: 'active' | 'archived';
}

export interface DashboardStats {
  openTickets: number;
  slaBreaches: number;
  agentsOnline: number;
  escalatedTickets: number;
  ticketTrends: {
    created: number[];
    resolved: number[];
    dates: string[];
  };
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  agentLeaderboard: {
    agentId: string;
    name: string;
    avatar?: string;
    ticketsHandled: number;
    avgResolutionTime: number;
    slaCompliance: number;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  actor: string;
  actorRole: string;
  actionType: 'create' | 'update' | 'delete' | 'assign' | 'escalate' | 'resolve' | 'login' | 'sla_change';
  targetObject: string;
  targetType: 'ticket' | 'agent' | 'sla' | 'category' | 'setting';
  description: string;
  ipAddress?: string;
  changes?: Record<string, any>;
}

export interface NotificationSetting {
  id: string;
  event: string;
  enabledRoles: string[];
  channels: ('in-app' | 'email' | 'push')[];
  template?: string;
}