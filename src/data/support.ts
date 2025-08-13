export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "agent" | "supervisor" | "admin";
  status: "active" | "inactive" | "suspended";
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
  category:
    | "wallet"
    | "login"
    | "payments"
    | "account"
    | "technical"
    | "billing";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "pending" | "escalated" | "resolved" | "closed";
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
  senderType: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface SLARule {
  id: string;
  priority: "low" | "medium" | "high" | "critical";
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
