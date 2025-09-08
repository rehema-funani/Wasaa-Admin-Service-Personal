import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Tag,
  Send,
  AlertTriangle,
  X,
  CheckCircle,
  UserPlus,
  AlertCircle,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Info,
  Upload,
  ExternalLink,
  RefreshCw,
  Shield,
  Activity
} from "lucide-react";
import supportService from "../../../api/services/support";
import toast from "react-hot-toast";
import ResolveModal from "../../../components/support/ResolveModal";
import EscalateModal from "../../../components/support/EscalateModal";
import AssignModal from "../../../components/support/AssignModal";

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
      toast.success("Ticket assigned successfully");
    } catch (err) {
      console.error("Failed to assign ticket:", err);
      toast.error("Failed to assign ticket");
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
      toast.success("Ticket escalated successfully");
    } catch (err) {
      console.error("Failed to escalate ticket:", err);
      toast.error("Failed to escalate ticket");
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
      toast.success("Ticket resolved successfully");
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
      toast.error("Failed to resolve ticket");
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
      toast.error("Failed to close ticket");
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
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-1.5 animate-pulse"></div>
            Open
          </div>
        );
      case "IN_PROGRESS":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            <div className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400 mr-1.5 animate-pulse"></div>
            In Progress
          </div>
        );
      case "RESOLVED":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
            <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-1.5"></div>
            Resolved
          </div>
        );
      case "CLOSED":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 mr-1.5"></div>
            Closed
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 mr-1.5"></div>
            {status}
          </div>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      CRITICAL: {
        color: "bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        icon: "🚨",
      },
      HIGH: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        icon: "🔥",
      },
      MEDIUM: {
        color: "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        icon: "⚡",
      },
      LOW: {
        color: "bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        icon: "📝",
      },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium">{priority.charAt(0) + priority.slice(1).toLowerCase()}</span>
      </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 dark:border-r-orange-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || "Ticket Not Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't load the ticket information. Please try again or contact support.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/admin/support/tickets")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tickets
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/support/tickets")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 bg-clip-text text-transparent truncate max-w-xl">
                  {ticket.subject}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    #{ticket.ticketNumber}
                  </span>
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => window.location.reload()}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
                <motion.button
                  className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  onClick={() => setShowResolveModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Resolve
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Overview */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    Customer
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-xs text-indigo-600 dark:text-indigo-400">
                      {ticket.user.firstName.charAt(0)}
                      {ticket.user.lastName.charAt(0)}
                    </div>
                    {getFullName(ticket.user.firstName, ticket.user.lastName)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    Category
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
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
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-xs text-green-600 dark:text-green-400">
                          {ticket.agent.user.firstName.charAt(0)}
                          {ticket.agent.user.lastName.charAt(0)}
                        </div>
                        {getFullName(
                          ticket.agent.user.firstName,
                          ticket.agent.user.lastName
                        )}
                      </div>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {ticket.description && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                    {ticket.description}
                  </p>
                </div>
              )}

              {ticket.tags && ticket.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Conversation Section */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                  Conversation
                </h2>
                <div className="flex items-center gap-2">
                  {getSlaStatusBadge(ticket.slaStatus)}
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                      ? "Completed"
                      : getTimeRemaining(ticket.resolutionDue)}
                  </span>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto bg-gray-50/50 dark:bg-slate-700/30 p-6">
                {ticket.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Get started by sending the first message to this customer.
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
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.isInternal
                              ? "bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800"
                              : message.senderType === "USER"
                              ? "bg-white/90 dark:bg-gray-700/90 border border-gray-100 dark:border-gray-600"
                              : message.senderType === "SYSTEM"
                              ? "bg-gray-50/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700"
                              : "bg-primary-50/90 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
                              {message.senderType === "USER" && message.user && (
                                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">
                                  {message.user.firstName.charAt(0)}
                                </div>
                              )}
                              {message.senderType === "AGENT" && message.agent && (
                                <div className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-xs text-green-600 dark:text-green-400">
                                  {message.agent.user.firstName.charAt(0)}
                                </div>
                              )}
                              {message.senderType === "SYSTEM" && (
                                <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                                  <Info className="w-3 h-3" />
                                </div>
                              )}
                              {getSenderName(message)}
                              {message.isInternal && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 text-xs rounded">
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
                                Attachments ({message.attachments.length})
                              </div>
                              <div className="space-y-2">
                                {message.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 bg-white/70 dark:bg-gray-600/70 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                                  >
                                    <Paperclip className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                                    <span className="truncate flex-1">
                                      {attachment.fileName}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                      {(attachment.fileSize / 1024).toFixed(1)} KB
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-slate-800/50">
                <form onSubmit={handleSendMessage}>
                  <div className="mb-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={() => setIsInternal(!isInternal)}
                        className="h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 bg-white dark:bg-gray-700"
                      />
                      <span className="ml-2">
                        Internal note (not visible to customer)
                      </span>
                    </label>
                    <div className="flex space-x-2">
                      <motion.button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Attach
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={messageLoading || !newMessage.trim()}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium ${
                          messageLoading || !newMessage.trim()
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        }`}
                        whileHover={messageLoading || !newMessage.trim() ? {} : { scale: 1.02 }}
                        whileTap={messageLoading || !newMessage.trim() ? {} : { scale: 0.98 }}
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
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Actions & Details */}
          <div className="space-y-6">
            {/* Alert Banner for SLA Status */}
            {ticket.slaStatus === "AT_RISK" || ticket.slaStatus === "BREACHED" ? (
              <motion.div
                className={`rounded-2xl p-6 text-white relative overflow-hidden ${
                  ticket.slaStatus === "BREACHED"
                    ? "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {ticket.slaStatus === "BREACHED" ? "SLA Breached" : "SLA At Risk"}
                    </h2>
                    <p className="text-white/80 mt-1">
                      {ticket.slaStatus === "BREACHED"
                        ? "This ticket has exceeded the resolution time. Immediate attention required."
                        : "This ticket requires attention soon to meet the SLA requirements."}
                    </p>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
              </motion.div>
            ) : null}

            {/* Actions Card */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  disabled={ticket.status === "CLOSED"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {ticket.agent ? "Reassign Ticket" : "Assign Ticket"}
                </motion.button>
                <motion.button
                  onClick={() => setShowEscalateModal(true)}
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  disabled={
                    ticket.status === "CLOSED" || ticket.status === "RESOLVED"
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Escalate
                </motion.button>
                <motion.button
                  onClick={() => setShowResolveModal(true)}
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  disabled={
                    ticket.status === "CLOSED" || ticket.status === "RESOLVED"
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve Ticket
                </motion.button>
                <motion.button
                  onClick={handleCloseTicket}
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  disabled={ticket.status === "CLOSED"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Ticket
                </motion.button>
              </div>
            </motion.div>

            {/* SLA Information */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                SLA Information
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      First Response
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        new Date(ticket.firstResponseDue) < new Date() &&
                        !ticket.firstResponseAt
                          ? "text-red-600 dark:text-red-400"
                          : ticket.firstResponseAt
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {ticket.firstResponseAt
                        ? "Completed"
                        : `Due ${formatRelativeTime(ticket.firstResponseDue)}`}
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        ticket.firstResponseAt
                          ? "bg-green-500 dark:bg-green-400"
                          : new Date(ticket.firstResponseDue) < new Date()
                          ? "bg-red-500 dark:bg-red-400"
                          : "bg-blue-500 dark:bg-blue-400"
                      }`}
                      style={{
                        width: ticket.firstResponseAt ? "100%" : "50%",
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {ticket.firstResponseAt
                      ? `Responded ${formatRelativeTime(ticket.firstResponseAt)}`
                      : new Date(ticket.firstResponseDue) < new Date()
                      ? "Response overdue"
                      : `Target: ${formatDate(ticket.firstResponseDue)}`}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Resolution
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        new Date(ticket.resolutionDue) < new Date() &&
                        !ticket.resolvedAt
                          ? "text-red-600 dark:text-red-400"
                          : ticket.resolvedAt
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {ticket.resolvedAt
                        ? "Completed"
                        : `Due ${formatRelativeTime(ticket.resolutionDue)}`}
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        ticket.resolvedAt
                          ? "bg-green-500 dark:bg-green-400"
                          : new Date(ticket.resolutionDue) < new Date()
                          ? "bg-red-500 dark:bg-red-400"
                          : "bg-blue-500 dark:bg-blue-400"
                      }`}
                      style={{
                        width: ticket.resolvedAt ? "100%" : "50%",
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {ticket.resolvedAt
                      ? `Resolved ${formatRelativeTime(ticket.resolvedAt)}`
                      : new Date(ticket.resolutionDue) < new Date()
                      ? "Resolution overdue"
                      : `Target: ${formatDate(ticket.resolutionDue)}`}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Current Status
                    </div>
                    <div className="font-medium">
                      {getSlaStatusBadge(ticket.slaStatus)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer"
                onClick={() => setShowActivities(!showActivities)}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-500" />
                  Activity Log
                </h3>
                <motion.div
                  animate={{ rotate: showActivities ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </div>

              {showActivities && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 max-h-[300px] overflow-y-auto"
                >
                  {ticket.activities.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No activities recorded
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {ticket.activities.map((activity) => (
                        <div key={activity.id} className="flex">
                          <div className="flex-shrink-0 mr-3">
                            <div className="mt-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1.5">
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
                              <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-600">
                                {activity.previousValue && (
                                  <div className="text-gray-600 dark:text-gray-400">
                                    From:{" "}
                                    <span className="font-medium text-gray-800 dark:text-gray-300">
                                      {activity.previousValue}
                                    </span>
                                  </div>
                                )}
                                {activity.newValue && (
                                  <div className="text-gray-600 dark:text-gray-400 mt-1">
                                    To:{" "}
                                    <span className="font-medium text-gray-800 dark:text-gray-300">
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
                </motion.div>
              )}
            </motion.div>

            {/* Customer Information */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                Customer Information
              </h3>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center text-white font-medium text-lg mr-4">
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
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400">
                    Language
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.user.language.toUpperCase()}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400">
                    Timezone
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.user.timezone}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400">
                    Account Status
                  </div>
                  <div className="font-medium">
                    {ticket.user.isActive ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <div className="text-gray-500 dark:text-gray-400">
                    User ID
                  </div>
                  <div
                    className="font-mono font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]"
                    title={ticket.user.id}
                  >
                    {ticket.user.externalUserId}
                  </div>
                </div>
                {ticket.user.phoneNumber && (
                  <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">
                      Phone
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {ticket.user.phoneNumber}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Category Information */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-500" />
                Category Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400">
                    Category
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {ticket.category.icon && (
                      <span>{ticket.category.icon}</span>
                    )}
                    {ticket.category.name}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400">
                    First Response SLA
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.category.firstResponseSla} mins
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400">
                    Resolution SLA
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.category.resolutionSla} mins
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <div className="text-gray-500 dark:text-gray-400">
                    Default Priority
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.category.defaultPriority}
                  </div>
                </div>
                {ticket.category.description && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Description
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {ticket.category.description}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAssignModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAssignModal(false)}
        >
          <motion.div
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-slate-700/30 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AssignModal
              setShowAssignModal={setShowAssignModal}
              assignData={assignData}
              setAssignData={setAssignData}
              handleAssignTicket={handleAssignTicket}
              agents={agents}
              loadingAgents={loadingAgents}
              getFullName={getFullName}
            />
          </motion.div>
        </motion.div>
      )}

      {showEscalateModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEscalateModal(false)}
        >
          <motion.div
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-slate-700/30 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <EscalateModal
              setShowEscalateModal={setShowEscalateModal}
              escalateData={escalateData}
              setEscalateData={setEscalateData}
              handleEscalateTicket={handleEscalateTicket}
              agents={agents}
              loadingAgents={loadingAgents}
              getFullName={getFullName}
            />
          </motion.div>
        </motion.div>
      )}

      {showResolveModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResolveModal(false)}
        >
          <motion.div
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-slate-700/30 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ResolveModal
              setShowResolveModal={setShowResolveModal}
              resolveData={resolveData}
              setResolveData={setResolveData}
              handleResolveTicket={handleResolveTicket}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}