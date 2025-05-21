// pages/support/assignments/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    Search,
    Users,
    FileText,
    X,
    ExternalLink,
    AlertTriangle,
    Clock,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/common/Card';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { ticketService } from '../../../api/services/ticket';
import userService from '../../../api/services/users';

// Updated types to match the API response
interface User {
    id: string;
    name: string;
    avatar?: string;
}

interface Team {
    id: string;
    title: string;
    level: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

interface Ticket {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    title: string;
    description: string;
    ticketType: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
    communicationChannel: string;
    assignedTo: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

interface TicketAssignment {
    id: string;
    ticket_id: string;
    assigned_to: string; // This is the team ID
    assigned_at: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    ticket: Ticket;
    team: Team;
}

interface TicketAssignmentResponse {
    ticketAssignments: TicketAssignment[];
    meta: {
        totalPages: number;
        currentPage: number;
        pageSize: number;
        totalAssignments: number;
    };
}

const AssignmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<TicketAssignment[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTeam, setFilterTeam] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get ticket assignments
            const assignmentsResponse = await ticketService.getTicketAssignments();
            setAssignments(assignmentsResponse.ticketAssignments);

            // Collect all user IDs from teams and tickets
            const userIds = new Set<string>();
            assignmentsResponse.ticketAssignments.forEach(assignment => {
                // Add team members
                assignment.team.members.forEach(memberId => userIds.add(memberId));

                // Add assigned user from ticket
                if (assignment.ticket.assignedTo) {
                    userIds.add(assignment.ticket.assignedTo);
                }

                // Add ticket creator
                if (assignment.ticket.createdBy) {
                    userIds.add(assignment.ticket.createdBy);
                }
            });

            // Fetch user details for all collected IDs
            const userDetails: Record<string, User> = {};
            await Promise.all(
                Array.from(userIds).map(async (userId) => {
                    try {
                        const user = await userService.getUserById(userId);
                        userDetails[userId] = {
                            id: user.id,
                            name: user.name ?? 'Unknown User',
                            avatar: user.avatar,
                        };
                    } catch (err) {
                        // Handle user not found
                        userDetails[userId] = {
                            id: userId,
                            name: 'Unknown User',
                        };
                    }
                })
            );

            setUsers(userDetails);
        } catch (err) {
            setError('Failed to fetch assignments data. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get user name by ID
    const getUserName = (userId: string): string => {
        return users[userId]?.name || 'Unknown User';
    };

    // Get user avatar by ID
    const getUserAvatar = (userId: string): string | undefined => {
        return users[userId]?.avatar;
    };

    // Handle deleting an assignment
    const handleDeleteAssignment = async (assignmentId: string) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) {
            return;
        }

        try {
            await ticketService.deleteTicketAssignment(assignmentId);
            setAssignments(prevAssignments =>
                prevAssignments.filter(a => a.id !== assignmentId)
            );
        } catch (err) {
            setError('Failed to delete assignment. Please try again later.');
            console.error(err);
        }
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <Badge variant="warning">Open</Badge>;
            case 'PENDING':
                return <Badge variant="info">Pending</Badge>;
            case 'RESOLVED':
                return <Badge variant="success">Resolved</Badge>;
            case 'CLOSED':
                return <Badge variant="secondary">Closed</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    // Get priority badge
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return <Badge variant="default">Low</Badge>;
            case 'MEDIUM':
                return <Badge variant="info">Medium</Badge>;
            case 'HIGH':
                return <Badge variant="warning">High</Badge>;
            case 'URGENT':
                return <Badge variant="danger">Urgent</Badge>;
            default:
                return <Badge variant="default">{priority}</Badge>;
        }
    };

    // Filter assignments based on search and filters
    const filteredAssignments = assignments.filter(assignment => {
        const ticketMatches =
            assignment.ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase());

        const teamMatches = filterTeam === 'all' || assignment.assigned_to === filterTeam;
        const statusMatches = filterStatus === 'all' || assignment.ticket.status === filterStatus;
        const priorityMatches = filterPriority === 'all' || assignment.ticket.priority === filterPriority;

        return ticketMatches && teamMatches && statusMatches && priorityMatches;
    });

    // Get unique teams for filter
    const uniqueTeams = Array.from(
        new Set(assignments.map(a => a.assigned_to))
    ).map(teamId => {
        const team = assignments.find(a => a.assigned_to === teamId)?.team;
        return {
            id: teamId,
            title: team?.title || 'Unknown Team'
        };
    });

    if (isLoading) {
        return (
            <>
                <div className="p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="p-6">
                <div className="mb-6 flex items-center">
                    <ClipboardList size={24} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-semibold text-gray-900">Ticket Assignments</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <Card className="mb-6">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by ticket ID, title or customer name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <select
                                    value={filterTeam}
                                    onChange={(e) => setFilterTeam(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Teams</option>
                                    {uniqueTeams.map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="OPEN">Open</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full md:w-1/4 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Priorities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-12">
                        <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Assignments Found</h3>
                        <p className="text-gray-500">
                            {searchQuery || filterTeam !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                                ? 'Try adjusting your filters to see more results'
                                : 'There are no ticket assignments in the system yet'}
                        </p>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {filteredAssignments.length} Assignment{filteredAssignments.length !== 1 ? 's' : ''}
                                </h2>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                            <th className="px-4 py-3">Ticket</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Priority</th>
                                            <th className="px-4 py-3">Assigned Team</th>
                                            <th className="px-4 py-3">Assigned User</th>
                                            <th className="px-4 py-3">Date Assigned</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredAssignments.map((assignment) => (
                                            <tr key={assignment.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <FileText size={16} className="text-gray-400 mr-2" />
                                                            <a
                                                                href={`/admin/support/tickets/${assignment.ticket_id}`}
                                                                className="text-blue-600 hover:underline font-medium"
                                                            >
                                                                #{assignment.ticket_id.substring(0, 8)}
                                                            </a>
                                                        </div>
                                                        <p className="text-sm text-gray-800 mt-1">{assignment.ticket.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{assignment.ticket.customerName}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getStatusBadge(assignment.ticket.status)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getPriorityBadge(assignment.ticket.priority)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {assignment.team ? (
                                                        <div className="flex items-center">
                                                            <div className="bg-blue-100 p-1.5 rounded-lg mr-2">
                                                                <Users size={14} className="text-blue-600" />
                                                            </div>
                                                            <span>{assignment.team.title}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not assigned to a team</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {assignment.ticket.assignedTo ? (
                                                        <div className="flex items-center">
                                                            <Avatar
                                                                src={getUserAvatar(assignment.ticket.assignedTo)}
                                                                alt={getUserName(assignment.ticket.assignedTo)}
                                                                initials={getUserName(assignment.ticket.assignedTo).charAt(0)}
                                                                size="sm"
                                                                className="mr-2"
                                                            />
                                                            <span>{getUserName(assignment.ticket.assignedTo)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not assigned to a user</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-gray-500">
                                                    {new Date(assignment.assigned_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            rightIcon={<ExternalLink size={14} />}
                                                            onClick={() => navigate(`/admin/support/tickets/${assignment.ticket_id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:bg-red-50"
                                                            rightIcon={<X size={14} />}
                                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default AssignmentsPage;