import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Team, TicketEscalationFormData } from '../../types/team';

interface TicketEscalationFormProps {
    ticketId: string;
    teams: Team[];
    onEscalate: (ticketId: string, escalation: TicketEscalationFormData) => Promise<void>;
    isLoading?: boolean;
    currentEscalationLevel?: number;
}

export const TicketEscalationForm: React.FC<TicketEscalationFormProps> = ({
    ticketId,
    teams,
    onEscalate,
    isLoading = false,
    currentEscalationLevel = 0
}) => {
    const [escalationLevel, setEscalationLevel] = useState<number>(
        currentEscalationLevel ? currentEscalationLevel + 1 : 1
    );
    const [reason, setReason] = useState<string>('');
    const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>();
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
    const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);

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

        setSelectedUserId(undefined);
    }, [selectedTeamId, teams]);

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTeamId(value === '' ? undefined : value);
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedUserId(value === '' ? undefined : value);
    };

    const handleEscalate = async () => {
        const escalationData: TicketEscalationFormData = {
            reason,
            level: escalationLevel,
            newAssignment: (selectedTeamId || selectedUserId)
                ? {
                    teamId: selectedTeamId,
                    userId: selectedUserId
                }
                : undefined
        };

        await onEscalate(ticketId, escalationData);
    };

    return (
        <Card className="mb-6 border-red-100">
            <CardHeader className="flex items-center gap-2 text-red-600 bg-red-50">
                <AlertTriangle size={18} />
                <h3 className="text-lg font-medium">Escalate Ticket</h3>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Escalation Level
                    </label>
                    <select
                        value={escalationLevel}
                        onChange={(e) => setEscalationLevel(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={isLoading}
                    >
                        <option value={1}>Level 1 - First Escalation</option>
                        <option value={2}>Level 2 - Second Escalation</option>
                        <option value={3}>Level 3 - Urgent Escalation</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Escalation
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Explain why this ticket needs to be escalated"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        Reassign Ticket (Optional)
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Team
                            </label>
                            <select
                                value={selectedTeamId || ''}
                                onChange={handleTeamChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

                        {selectedTeamId && teamMembers.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Member
                                </label>
                                <select
                                    value={selectedUserId || ''}
                                    onChange={handleUserChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="danger"
                        onClick={handleEscalate}
                        isLoading={isLoading}
                        disabled={isLoading || !reason.trim()}
                        leftIcon={<AlertTriangle size={16} />}
                    >
                        Escalate Ticket
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};