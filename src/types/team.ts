export interface TeamMember {
  id: string;
  name?: string;
  email: string;
  role: string;
  avatar?: string;
  user?: any
}

export interface Team {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  members: TeamMember[];
  level?: string;
}

export interface TeamFormData {
  name: string;
  description: string;
  level: string;
  members: Array<any>;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'| 'urgent';
export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTeam?: string;
  assignedUser?: string;
  escalated: boolean;
  escalationLevel?: number;
  escalationReason?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
  createdBy: string;
  isInternal: boolean;
}

export interface TicketCommentFormData {
  content: string;
  isInternal: boolean;
}

export interface TicketAssignment {
  id: string;
  ticketId: string;
  teamId?: string;
  userId?: string;
  assignedAt: string;
  assignedBy: string;
}

export interface TicketEscalation {
  id: string;
  ticketId: string;
  escalatedAt: string;
  escalatedBy: string;
  reason: string;
  level: number;
  previousAssignment?: TicketAssignment;
  newAssignment?: TicketAssignment;
}

export interface TicketEscalationFormData {
  reason: string;
  level: number;
  newAssignment?: {
    teamId?: string;
    userId?: string;
  };
}