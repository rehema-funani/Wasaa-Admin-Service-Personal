// components/support/tickets/TicketAssignmentForm.tsx
import React, { useState, useEffect } from 'react';
import { Users, UserCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader } from '../common/Card';
import { Team } from '../../types/team';

interface TicketAssignmentFormProps {
    ticketId: string;
    teams: Team[];
    onAssign: (ticketId: string, teamId?: string, userId?: string) => Promise<void>;
    currentTeamId?: string;
    currentUserId?: string;
    isLoading?: boolean;
}

export const TicketAssignmentForm: React.FC<TicketAssignmentFormProps> = ({
    ticketId,
    teams,
    onAssign,
    currentTeamId,
    currentUserId,
    isLoading = false
}) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(currentTeamId);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(currentUserId);
    const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);

    // When a team is selected, populate the members dropdown
    useEffect(() => {
        if (selectedTeamId) {
            const selectedTeam = teams.find(team => team.id === selectedTeamId);
            if (selectedTeam) {
                setTeamMembers(selectedTeam.members.map(member => ({
                    id: member.id,
                    name: member.name
                })));
            } else {
                setTeamMembers([]);
            }
        } else {
            setTeamMembers([]);
        }

        // Reset selected user when team changes
        setSelectedUserId(undefined);
    }, [selectedTeamId, teams]);

    const handleAssign = async () => {
        await onAssign(ticketId, selectedTeamId, selectedUserId);
    };

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTeamId(value === '' ? undefined : value);
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedUserId(value === '' ? undefined : value);
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Ticket Assignment</h3>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign to Team
                        </label>
                        <div className="flex items-center">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Users size={16} className="text-gray-400" />
                                </div>
                                <select
                                    value={selectedTeamId || ''}
                                    onChange={handleTeamChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                >
                                    <option value="">Select a team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {selectedTeamId && teamMembers.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign to Team Member (Optional)
                            </label>
                            <div className="flex items-center">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <UserCircle size={16} className="text-gray-400" />
                                    </div>
                                    <select
                                        value={selectedUserId || ''}
                                        onChange={handleUserChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a team member</option>
                                        {teamMembers.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            onClick={handleAssign}
                            isLoading={isLoading}
                            disabled={isLoading || !selectedTeamId}
                        >
                            {currentTeamId || currentUserId ? 'Update Assignment' : 'Assign Ticket'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};