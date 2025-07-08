import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, Tag, MoreHorizontal, Send, ChevronUp, ChevronDown, CheckCircle, AlertTriangle, X } from 'lucide-react';
import supportService from '../../../api/services/support';

// Define ticket type
interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  assignedToName?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

// Define message type
interface Message {
  id: string;
  ticketId: string;
  sender: string;
  senderName: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [assignToUserId, setAssignToUserId] = useState('');
  const [escalationData, setEscalationData] = useState({ reason: '', escalateToUserId: '' });
  const [resolutionData, setResolutionData] = useState({ notes: '' });

  // Mock data for users (in a real app, this would come from an API)
  const users = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Mike Johnson' },
  ];

  // Fetch ticket and messages
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const ticketData = await supportService.getTicketById(id);
        setTicket(ticketData);

        const messagesData = await supportService.getTicketMessages(id);
        setMessages(messagesData);
      } catch (err) {
        setError('Failed to fetch ticket data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !id) return;

    setMessageLoading(true);
    try {
      const messageData = {
        content: newMessage,
        isInternal
      };

      const response = await supportService.createMessage(id, messageData);
      setMessages(prev => [...prev, response]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setMessageLoading(false);
    }
  };

  // Handle assign ticket
  const handleAssignTicket = async () => {
    if (!id || !assignToUserId) return;

    try {
      const response = await supportService.assignTicket(id, assignToUserId);
      setTicket(response);
      setShowAssignModal(false);
    } catch (err) {
      console.error('Failed to assign ticket:', err);
    }
  };

  // Handle escalate ticket
  const handleEscalateTicket = async () => {
    if (!id || !escalationData.reason || !escalationData.escalateToUserId) return;

    try {
      const response = await supportService.escalateTicket(id, escalationData);
      setTicket(response);
      setShowEscalateModal(false);
    } catch (err) {
      console.error('Failed to escalate ticket:', err);
    }
  };

  // Handle resolve ticket
  const handleResolveTicket = async () => {
    if (!id) return;

    try {
      const response = await supportService.resolveTicket(id, resolutionData);
      setTicket(response);
      setShowResolveModal(false);
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  // Handle close ticket
  const handleCloseTicket = async () => {
    if (!id) return;

    if (!window.confirm('Are you sure you want to close this ticket?')) return;

    try {
      const response = await supportService.closeTicket(id);
      setTicket(response);
    } catch (err) {
      console.error('Failed to close ticket:', err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch(priority?.toLowerCase()) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error || 'Ticket not found'}
        </div>
        <button
          className="flex items-center text-blue-600 hover:text-blue-800"
          onClick={() => navigate('/tickets')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        onClick={() => navigate('/tickets')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tickets
      </button>

      {/* Ticket Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800 mr-3">{ticket.title}</h1>
              <span className="text-gray-500">#{ticket.ticketNumber}</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`flex items-center text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                <AlertTriangle className="w-4 h-4 mr-1" />
                {ticket.priority}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <Tag className="w-4 h-4 mr-1" />
                {ticket.category}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Assign Ticket
                  </button>
                  <button
                    onClick={() => setShowEscalateModal(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Escalate Ticket
                  </button>
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                  >
                    Resolve Ticket
                  </button>
                  <button
                    onClick={handleCloseTicket}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={ticket.status === 'Closed'}
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-600 mt-4">
          <div className="flex items-center mb-2 md:mb-0">
            <User className="w-4 h-4 mr-1" />
            <span>Created by: {ticket.createdByName || ticket.createdBy}</span>
          </div>
          <div className="flex items-center mb-2 md:mb-0">
            <User className="w-4 h-4 mr-1" />
            <span>Assigned to: {ticket.assignedToName || ticket.assignedTo || 'Unassigned'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Created: {formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Messages Section */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Conversation</h2>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.isInternal
                    ? 'bg-yellow-50 border border-yellow-100'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">
                      {message.senderName || message.sender}
                    </div>
                    {message.isInternal && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                        Internal
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(message.createdAt)}
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t">
          <form onSubmit={handleSendMessage}>
            <div className="mb-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={() => setIsInternal(!isInternal)}
                  className="mr-2 h-4 w-4 text-blue-600 rounded"
                />
                Internal note (not visible to customer)
              </label>
              <button
                type="submit"
                disabled={messageLoading || !newMessage.trim()}
                className={`flex items-center px-4 py-2 rounded-md ${
                  messageLoading || !newMessage.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {messageLoading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Assign Ticket</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to
              </label>
              <select
                value={assignToUserId}
                onChange={(e) => setAssignToUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTicket}
                disabled={!assignToUserId}
                className={`px-4 py-2 rounded-md ${
                  !assignToUserId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Escalate Ticket</h2>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escalate to
              </label>
              <select
                value={escalationData.escalateToUserId}
                onChange={(e) => setEscalationData({...escalationData, escalateToUserId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for escalation
              </label>
              <textarea
                value={escalationData.reason}
                onChange={(e) => setEscalationData({...escalationData, reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalateTicket}
                disabled={!escalationData.escalateToUserId || !escalationData.reason}
                className={`px-4 py-2 rounded-md ${
                  !escalationData.escalateToUserId || !escalationData.reason
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Escalate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Resolve Ticket</h2>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution notes
              </label>
              <textarea
                value={resolutionData.notes}
                onChange={(e) => setResolutionData({...resolutionData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveTicket}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
