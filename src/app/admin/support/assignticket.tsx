// pages/support/assignments/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    Search,
    Users,
    FileText,
    X,
    ExternalLink
} from 'lucide-react';
import { Team, TicketAssignment } from '../../../types/team';
import { ticketService } from '../../../api/services/ticket';
import { teamService } from '../../../api/services/team';
import { Card, CardContent, CardHeader } from '../../../components/common/Card';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';

const AssignmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<TicketAssignment[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTeam, setFilterTeam] = useState<string>('all');
    const [filterUser, setFilterUser] = useState<string>('all');

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [assignmentsData, teamsData] = await Promise.all([
                ticketService.getTicketAssignments(),
                teamService.getTeams()
            ]);

            setAssignments(assignmentsData);
            setTeams(teamsData);
        } catch (err) {
            setError('Failed to fetch assignments data. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get team name by ID
    const getTeamName = (teamId: string): string => {
        const team = teams.find(t => t.id === teamId);
        return team?.name || 'Unknown Team';
    };

    // Get user name by ID from team members
    const getUserName = (userId: string): string => {
        for (const team of teams) {
            const member = team.members.find(m => m.id === userId);
            if (member) {
                return member.name;
            }
        }
        return 'Unknown User';
    };

    // Get user avatar by ID from team members
    const getUserAvatar = (userId: string): string | undefined => {
        for (const team of teams) {
            const member = team.members.find(m => m.id === userId);
            if (member) {
                return member.avatar;
            }
        }
        return undefined;
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

    // Filter assignments based on search and filters
    const filteredAssignments = assignments.filter(assignment => {
        // Search by ticket ID
        const matchesSearch = assignment.ticketId.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by team
        const matchesTeam = filterTeam === 'all' || assignment.teamId === filterTeam;

        // Filter by user
        const matchesUser = filterUser === 'all' || assignment.userId === filterUser;

        // Filter by escalated only - we would need additional data for this
        // In a real implementation, we would have the ticket details included in the assignment
        // For now, we'll assume escalated status is determined elsewhere

        return matchesSearch && matchesTeam && matchesUser;
    });

    // Get unique teams and users for filters
    const uniqueTeams = Array.from(new Set(assignments.map(a => a.teamId).filter(Boolean) as string[]));
    const uniqueUsers = Array.from(new Set(assignments.map(a => a.userId).filter(Boolean) as string[]));

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
                                        placeholder="Search by ticket ID..."
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
                                    {uniqueTeams.map(teamId => (
                                        <option key={teamId} value={teamId}>
                                            {getTeamName(teamId)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <select
                                    value={filterUser}
                                    onChange={(e) => setFilterUser(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Users</option>
                                    {uniqueUsers.map(userId => (
                                        <option key={userId} value={userId}>
                                            {getUserName(userId)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-12">
                        <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Assignments Found</h3>
                        <p className="text-gray-500">
                            {searchQuery || filterTeam !== 'all' || filterUser !== 'all'
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
                                                    <div className="flex items-center">
                                                        <FileText size={16} className="text-gray-400 mr-2" />
                                                        <a
                                                            href={`/support/tickets/${assignment.ticketId}`}
                                                            className="text-blue-600 hover:underline font-medium"
                                                        >
                                                            #{assignment.ticketId}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {assignment.teamId ? (
                                                        <div className="flex items-center">
                                                            <div className="bg-blue-100 p-1.5 rounded-lg mr-2">
                                                                <Users size={14} className="text-blue-600" />
                                                            </div>
                                                            <span>{getTeamName(assignment.teamId)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not assigned to a team</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {assignment.userId ? (
                                                        <div className="flex items-center">
                                                            <Avatar
                                                                src={getUserAvatar(assignment.userId)}
                                                                alt={getUserName(assignment.userId)}
                                                                initials={getUserName(assignment.userId).charAt(0)}
                                                                size="sm"
                                                                className="mr-2"
                                                            />
                                                            <span>{getUserName(assignment.userId)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not assigned to a user</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-gray-500">
                                                    {new Date(assignment.assignedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            rightIcon={<ExternalLink size={14} />}
                                                            onClick={() => navigate(`/support/tickets/${assignment.ticketId}`)}
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