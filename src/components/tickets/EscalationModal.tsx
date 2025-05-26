import React, { useEffect, useState } from 'react'
import { Team } from '../../types/team';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

const EscalationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onEscalate: (escalationData: any) => void;
    teams: Team[];
    currentLevel: string;
    isSubmitting: boolean;
}> = ({ isOpen, onClose, onEscalate, teams, currentLevel, isSubmitting }) => {
    const [formData, setFormData] = useState<any>({
        level: '',
        reason: ''
    });
    const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
    const [selectedUser, setSelectedUser] = useState<string | undefined>();
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    useEffect(() => {
        let nextLevel = 'LEVEL_1';
        if (currentLevel === 'LEVEL_1') nextLevel = 'LEVEL_2';
        if (currentLevel === 'LEVEL_2') nextLevel = 'LEVEL_3';

        setFormData((prev: { level: string; reason: string }) => ({
            ...prev,
            level: nextLevel
        }));
    }, [currentLevel]);

    useEffect(() => {
        if (selectedTeam) {
            // This would be replaced with actual API call to get team members
            fetchTeamMembers(selectedTeam);
        } else {
            setAvailableUsers([]);
            setSelectedUser(undefined);
        }
    }, [selectedTeam]);

    const fetchTeamMembers = async (teamId: string) => {
        setIsLoadingUsers(true);
        try {
            // Replace with actual API call
            const team = teams.find(t => t.id === teamId);
            setAvailableUsers(
                (team?.members || []).filter((member) => member.name !== undefined) as { id: string; name: string }[]
            );
        } catch (error) {
            console.error("Failed to fetch team members", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: { level: string; reason: string }) => ({ ...prev, [name]: value }));
    };

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeam(e.target.value || undefined);
        // Reset selected user when team changes
        setSelectedUser(undefined);
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(e.target.value || undefined);
    };

    const handleSubmit = () => {
        const escalationData = {
            reason: formData.reason,
            newAssignment: selectedTeam ? {
                teamId: selectedTeam,
                userId: selectedUser
            } : undefined
        };

        onEscalate(escalationData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Escalate Ticket"
        >
            <div className="p-1 space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Escalation Level
                    </label>
                    <div className="relative">
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all duration-200 appearance-none"
                            required
                        >
                            <option value="LEVEL_1">Level 1 Support</option>
                            <option value="LEVEL_2">Level 2 Support</option>
                            <option value="LEVEL_3">Level 3 Support</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Escalation Reason
                    </label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all duration-200"
                        rows={3}
                        required
                        placeholder="Why does this ticket need to be escalated?"
                    />
                </div>

                <div className="bg-primary-50/50 p-3 rounded-lg border border-primary-100/50 mb-3">
                    <h4 className="text-sm font-medium text-primary-700 mb-2">Reassign Ticket</h4>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                Support Team
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedTeam || ""}
                                    onChange={handleTeamChange}
                                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all duration-200 appearance-none"
                                >
                                    <option value="">Select a team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>
                                            {team.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {selectedTeam && (
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Team Member
                                </label>
                                <div className="relative">
                                    {isLoadingUsers ? (
                                        <div className="w-full px-3 py-2 bg-white/90 border border-gray-100/70 rounded-lg text-sm text-gray-500">
                                            Loading users...
                                        </div>
                                    ) : (
                                        <select
                                            value={selectedUser || ""}
                                            onChange={handleUserChange}
                                            className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all duration-200 appearance-none"
                                        >
                                            <option value="">Unassigned</option>
                                            {availableUsers.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="border-gray-100/70 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 text-sm rounded-lg transition-all duration-200 py-1.5 px-3"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={isSubmitting || !formData.level || !formData.reason}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                    >
                        Escalate
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EscalationModal
