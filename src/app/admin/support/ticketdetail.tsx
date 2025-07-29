import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Tag,
  MoreHorizontal,
  Send,
  AlertTriangle,
  X,
  CheckCircle,
  UserPlus,
  AlertCircle,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Calendar,
  Info,
  Upload,
  ExternalLink,
} from "lucide-react";
import supportService from "../../../api/services/support";
import toast from "react-hot-toast";

interface User {
  id: string;
  externalUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  department: string | null;
  language: string;
  timezone: string;
  isActive: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  isActive: boolean;
  firstResponseSla: number;
  resolutionSla: number;
  defaultPriority: string;
  autoAssignToRole: string | null;
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
}

interface AgentUser {
  id: string;
  externalUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  department: string | null;
  language: string;
  timezone: string;
  isActive: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Agent {
  id: string;
  userId: string;
  role: string;
  department: string;
  specializations: string[];
  isOnline: boolean;
  isAvailable: boolean;
  maxConcurrentChats: number;
  currentChats: number;
  performanceScore: number | null;
  totalTicketsHandled: number;
  avgResolutionTime: number | null;
  slaComplianceRate: number | null;
  createdAt: string;
  updatedAt: string;
  user: AgentUser;
}

interface Attachment {
  id: string;
  ticketId: string;
  messageId: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  ticketId: string;
  senderType: "USER" | "AGENT" | "SYSTEM";
  userId: string | null;
  agentId: string | null;
  content: string;
  messageType: "TEXT" | "HTML" | "SYSTEM";
  isRead: boolean;
  readAt: string | null;
  isInternal: boolean;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
  user: User | null;
  agent: Agent | null;
  attachments: Attachment[];
}

interface Activity {
  id: string;
  ticketId: string;
  activityType: string;
  description: string;
  performedBy: string;
  performedByType: "USER" | "AGENT" | "SYSTEM";
  previousValue: string | null;
  newValue: string | null;
  createdAt: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  categoryId: string;
  status: string;
  priority: string;
  channel: string;
  agentId: string | null;
  slaStatus: string;
  firstResponseAt: string | null;
  firstResponseDue: string;
  resolutionDue: string;
  resolvedAt: string | null;
  closedAt: string | null;
  escalationLevel: number;
  escalatedAt: string | null;
  escalationReason: string | null;
  tags: string[];
  internalNotes: string | null;
  customerSatisfactionScore: number | null;
  customerFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  category: Category;
  agent: Agent | null;
  messages: Message[];
  attachments: Attachment[];
  activities: Activity[];
}

interface TicketResponse {
  success: boolean;
  data: {
    ticket: Ticket;
  };
}

interface AssignModalData {
  userId: string;
}

interface EscalateModalData {
  reason: string;
  escalateToUserId: string;
}

interface ResolveModalData {
  resolutionNotes: string;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [assignData, setAssignData] = useState<AssignModalData>({ userId: "" });
  const [escalateData, setEscalateData] = useState<EscalateModalData>({
    reason: "",
    escalateToUserId: "",
  });
  const [resolveData, setResolveData] = useState<ResolveModalData>({
    resolutionNotes: "",
  });

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoadingAgents(true);
      try {
        const response = await supportService.getAgents();
        setAgents(response.data);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await supportService.getTicketById(id);
        if (response.success) {
          setTicket(response.data.ticket);
        } else {
          setError("Failed to fetch ticket data");
        }
      } catch (err) {
        setError("Failed to fetch ticket data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !id) return;

    setMessageLoading(true);
    try {
      const messageData = {
        content: newMessage,
        isInternal,
      };

      await supportService.createMessage(id, messageData);
      const updatedTicket = await supportService.getTicketById(id);
      if (updatedTicket.success) {
        setTicket(updatedTicket.data.ticket);
      }

      setNewMessage("");
      setIsInternal(false);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleAssignTicket = async () => {
    if (!id || !assignData.userId) return;

    try {
      await supportService.assignTicket(id, assignData.userId);

      const updatedTicket = await supportService.getTicketById(id);
      if (updatedTicket.success) {
        setTicket(updatedTicket.data.ticket);
      }

      setShowAssignModal(false);
    } catch (err) {
      console.error("Failed to assign ticket:", err);
    }
  };

  const handleEscalateTicket = async () => {
    if (!id || !escalateData.reason || !escalateData.escalateToUserId) return;

    try {
      await supportService.escalateTicket(id, escalateData);

      const updatedTicket = await supportService.getTicketById(id);
      if (updatedTicket.success) {
        setTicket(updatedTicket.data.ticket);
      }

      setShowEscalateModal(false);
    } catch (err) {
      console.error("Failed to escalate ticket:", err);
    }
  };

  const handleResolveTicket = async () => {
    if (!id) return;

    try {
      await supportService.resolveTicket(id, resolveData);

      const updatedTicket = await supportService.getTicketById(id);
      if (updatedTicket.success) {
        setTicket(updatedTicket.data.ticket);
      }

      setShowResolveModal(false);
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  const handleCloseTicket = async () => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to close this ticket?")) return;

    try {
      await supportService.closeTicket(id);

      const updatedTicket = await supportService.getTicketById(id);
      toast.success("Ticket closed successfully");
      if (updatedTicket.success) {
        setTicket(updatedTicket.data.ticket);
      }
    } catch (err) {
      console.error("Failed to close ticket:", err);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const getSenderName = (message: Message) => {
    if (message.senderType === "USER" && message.user) {
      return getFullName(message.user.firstName, message.user.lastName);
    } else if (message.senderType === "AGENT" && message.agent) {
      return getFullName(
        message.agent.user.firstName,
        message.agent.user.lastName
      );
    } else {
      return "System";
    }
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();

    if (diffMs < 0) return "Overdue";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days}d left`;
    } else if (diffHours > 0) {
      return `${diffHours}h left`;
    } else {
      return `${diffMins}m left`;
    }
  };

  const getSlaStatusBadge = (slaStatus: string) => {
    switch (slaStatus) {
      case "WITHIN_SLA":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            <Clock className="w-3 h-3 mr-1" />
            Within SLA
          </span>
        );
      case "AT_RISK":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            At Risk
          </span>
        );
      case "BREACHED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            SLA Breached
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            <Info className="w-3 h-3 mr-1" />
            {slaStatus}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-1.5"></div>
            Open
          </div>
        );
      case "IN_PROGRESS":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
            <div className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400 mr-1.5"></div>
            In Progress
          </div>
        );
      case "RESOLVED":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-1.5"></div>
            Resolved
          </div>
        );
      case "CLOSED":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 mr-1.5"></div>
            Closed
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 mr-1.5"></div>
            {status}
          </div>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    let bgColor = "";
    let textColor = "";
    let icon = null;

    switch (priority) {
      case "CRITICAL":
        bgColor = "bg-red-50 dark:bg-red-900/30";
        textColor = "text-red-700 dark:text-red-400";
        icon = <AlertTriangle className="w-3 h-3 mr-1" />;
        break;
      case "HIGH":
        bgColor = "bg-orange-50 dark:bg-orange-900/30";
        textColor = "text-orange-700 dark:text-orange-400";
        icon = <AlertCircle className="w-3 h-3 mr-1" />;
        break;
      case "MEDIUM":
        bgColor = "bg-yellow-50 dark:bg-yellow-900/30";
        textColor = "text-yellow-700 dark:text-yellow-400";
        icon = <AlertCircle className="w-3 h-3 mr-1" />;
        break;
      case "LOW":
        bgColor = "bg-green-50 dark:bg-green-900/30";
        textColor = "text-green-700 dark:text-green-400";
        icon = <Info className="w-3 h-3 mr-1" />;
        break;
      default:
        bgColor = "bg-gray-50 dark:bg-gray-700";
        textColor = "text-gray-700 dark:text-gray-300";
        icon = <Info className="w-3 h-3 mr-1" />;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "CREATED":
        return (
          <MessageSquare className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        );
      case "ASSIGNED":
        return (
          <UserPlus className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        );
      case "ESCALATED":
        return (
          <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
        );
      case "STATUS_CHANGED":
        return <Tag className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      case "RESOLVED":
        return (
          <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
        );
      case "CLOSED":
        return <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-indigo-600 dark:text-indigo-400 rounded-full"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">
              {error || "Ticket not found"}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load the ticket information. Please try again or contact
            support.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="inline-flex items-center mb-6 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all tickets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-600">
                <div className="px-6 py-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mr-3">
                          {ticket.subject}
                        </h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          #{ticket.ticketNumber}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 space-x-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Customer
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {getFullName(ticket.user.firstName, ticket.user.lastName)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </div>
                    <div className="font-medium flex items-center text-gray-900 dark:text-gray-100">
                      {ticket.category.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Created
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {formatRelativeTime(ticket.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Assigned To
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {ticket.agent ? (
                        getFullName(
                          ticket.agent.user.firstName,
                          ticket.agent.user.lastName
                        )
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Conversation
                </h2>
                <div className="flex items-center">
                  {getSlaStatusBadge(ticket.slaStatus)}
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                      ? "Completed"
                      : getTimeRemaining(ticket.resolutionDue)}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 max-h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-700">
                {ticket.messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      No messages
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by sending a message.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ticket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderType === "AGENT"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.isInternal
                              ? "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-600"
                              : message.senderType === "USER"
                              ? "bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500"
                              : "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-600"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {getSenderName(message)}
                              {message.isInternal && (
                                <span className="ml-2 px-1.5 py-0.5 bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-300 text-xs rounded">
                                  Internal
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                              {formatRelativeTime(message.createdAt)}
                            </div>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                          {message.attachments.length > 0 && (
                            <div className="mt-3 border-t border-gray-100 dark:border-gray-600 pt-3">
                              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Attachments
                              </div>
                              <div className="space-y-2">
                                {message.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 bg-white dark:bg-gray-500 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    <Paperclip className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                    <span className="truncate flex-1">
                                      {attachment.fileName}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 ml-1" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                <form onSubmit={handleSendMessage}>
                  <div className="mb-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={() => setIsInternal(!isInternal)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-700"
                      />
                      <span className="ml-2">
                        Internal note (not visible to customer)
                      </span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Attach
                      </button>
                      <button
                        type="submit"
                        disabled={messageLoading || !newMessage.trim()}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                          messageLoading || !newMessage.trim()
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        }`}
                      >
                        {messageLoading ? (
                          <>
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions & Details */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Actions
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={ticket.status === "CLOSED"}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {ticket.agent ? "Reassign Ticket" : "Assign Ticket"}
                </button>
                <button
                  onClick={() => setShowEscalateModal(true)}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={
                    ticket.status === "CLOSED" || ticket.status === "RESOLVED"
                  }
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Escalate
                </button>
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={
                    ticket.status === "CLOSED" || ticket.status === "RESOLVED"
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve Ticket
                </button>
                <button
                  onClick={handleCloseTicket}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={ticket.status === "CLOSED"}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Ticket
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  SLA Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      First Response
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {ticket.firstResponseAt ? "Completed" : "Pending"}
                      </div>
                      <div
                        className={`text-sm ${
                          new Date(ticket.firstResponseDue) < new Date() &&
                          !ticket.firstResponseAt
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {ticket.firstResponseAt
                          ? formatRelativeTime(ticket.firstResponseAt)
                          : `Due ${formatRelativeTime(
                              ticket.firstResponseDue
                            )}`}
                      </div>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          ticket.firstResponseAt
                            ? "bg-green-500"
                            : new Date(ticket.firstResponseDue) < new Date()
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: ticket.firstResponseAt ? "100%" : "50%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Resolution
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {ticket.resolvedAt ? "Completed" : "Pending"}
                      </div>
                      <div
                        className={`text-sm ${
                          new Date(ticket.resolutionDue) < new Date() &&
                          !ticket.resolvedAt
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {ticket.resolvedAt
                          ? formatRelativeTime(ticket.resolvedAt)
                          : `Due ${formatRelativeTime(ticket.resolutionDue)}`}
                      </div>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          ticket.resolvedAt
                            ? "bg-green-500"
                            : new Date(ticket.resolutionDue) < new Date()
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: ticket.resolvedAt ? "100%" : "50%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      SLA Status
                    </div>
                    <div className="font-medium">
                      {getSlaStatusBadge(ticket.slaStatus)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div
                className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer"
                onClick={() => setShowActivities(!showActivities)}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Activity Log
                </h2>
                <ChevronRight
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    showActivities ? "transform rotate-90" : ""
                  }`}
                />
              </div>

              {showActivities && (
                <div className="p-6">
                  <div className="space-y-4">
                    {ticket.activities.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No activities recorded
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {ticket.activities.map((activity) => (
                          <div key={activity.id} className="flex">
                            <div className="flex-shrink-0 mr-3">
                              <div className="mt-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                                {getActivityIcon(activity.activityType)}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {activity.description}
                              </div>
                              <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(activity.createdAt)}
                              </div>
                              {(activity.previousValue ||
                                activity.newValue) && (
                                <div className="mt-2 text-sm">
                                  {activity.previousValue && (
                                    <div className="text-gray-500 dark:text-gray-400">
                                      From:{" "}
                                      <span className="font-medium">
                                        {activity.previousValue}
                                      </span>
                                    </div>
                                  )}
                                  {activity.newValue && (
                                    <div className="text-gray-500 dark:text-gray-400">
                                      To:{" "}
                                      <span className="font-medium">
                                        {activity.newValue}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Customer Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-lg mr-4">
                    {ticket.user.firstName.charAt(0)}
                    {ticket.user.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {getFullName(ticket.user.firstName, ticket.user.lastName)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ticket.user.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <div className="text-gray-500 dark:text-gray-400">
                      Language
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {ticket.user.language.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500 dark:text-gray-400">
                      Timezone
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {ticket.user.timezone}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500 dark:text-gray-400">
                      Account Status
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {ticket.user.isActive ? (
                        <span className="text-green-600 dark:text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500 dark:text-gray-400">
                      User ID
                    </div>
                    <div
                      className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]"
                      title={ticket.user.id}
                    >
                      {ticket.user.externalUserId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Assign Ticket
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assign to Agent
              </label>
              {loadingAgents ? (
                <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
              ) : (
                <select
                  value={assignData.userId}
                  onChange={(e) =>
                    setAssignData({ ...assignData, userId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.userId}>
                      {getFullName(agent.user.firstName, agent.user.lastName)} (
                      {agent.department})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTicket}
                disabled={!assignData.userId}
                className={`px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !assignData.userId
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {showEscalateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Escalate Ticket
              </h2>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Escalate to
              </label>
              {loadingAgents ? (
                <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
              ) : (
                <select
                  value={escalateData.escalateToUserId}
                  onChange={(e) =>
                    setEscalateData({
                      ...escalateData,
                      escalateToUserId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select an agent</option>
                  {agents
                    .filter(
                      (agent) =>
                        agent.role === "supervisor" || agent.role === "admin"
                    )
                    .map((agent) => (
                      <option key={agent.id} value={agent.userId}>
                        {getFullName(agent.user.firstName, agent.user.lastName)}{" "}
                        ({agent.role})
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for escalation
              </label>
              <textarea
                value={escalateData.reason}
                onChange={(e) =>
                  setEscalateData({ ...escalateData, reason: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                rows={3}
                placeholder="Explain why this ticket needs to be escalated..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalateTicket}
                disabled={
                  !escalateData.escalateToUserId || !escalateData.reason
                }
                className={`px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !escalateData.escalateToUserId || !escalateData.reason
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Escalate
              </button>
            </div>
          </div>
        </div>
      )}

      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Resolve Ticket
              </h2>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resolution notes
              </label>
              <textarea
                value={resolveData.resolutionNotes}
                onChange={(e) =>
                  setResolveData({
                    ...resolveData,
                    resolutionNotes: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                rows={3}
                placeholder="Provide details about how this issue was resolved..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveTicket}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
