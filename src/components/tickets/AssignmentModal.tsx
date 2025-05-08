import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import userService from '../../api/services/users';

const AssignmentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAssign: (teamId?: string, userId?: string) => void;
    teams: any[];
    currentTeamId?: string;
    currentUserId?: string;
    isSubmitting: boolean;
}> = ({
    isOpen,
    onClose,
    onAssign,
    teams,
    currentTeamId,
    currentUserId,
    isSubmitting,
}) => {
        const [assignType, setAssignType] = useState<'TEAM' | 'USER'>('TEAM');
        const [selectedTeam, setSelectedTeam] = useState<string | undefined>(currentTeamId);
        const [selectedUser, setSelectedUser] = useState<string | undefined>(currentUserId);
        const [adminUsers, setAdminUsers] = useState<any[]>([]);
        const [isLoadingUsers, setIsLoadingUsers] = useState(false);

        useEffect(() => {
            if (assignType === 'USER') {
                fetchAdminUsers();
            }
        }, [assignType]);

        const fetchAdminUsers = async () => {
            setIsLoadingUsers(true);
            try {
                const response = await userService.getAdminUsers();
                setAdminUsers(response.users);
            } catch (error) {
                console.error('Failed to fetch admin users', error);
            } finally {
                setIsLoadingUsers(false);
            }
        };

        const handleAssign = () => {
            if (assignType === 'TEAM') {
                onAssign(selectedTeam, undefined);
            } else {
                onAssign(undefined, selectedUser);
            }
        };

        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Assign Ticket" size="sm">
                <div className="p-1 space-y-4">
                    {/* Tabs */}
                    <div className="flex space-x-2 border-b border-gray-200">
                        {['TEAM', 'USER'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setAssignType(type as 'TEAM' | 'USER')}
                                className={`py-2 px-4 text-sm font-medium transition-all ${assignType === type
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {type === 'TEAM' ? 'Assign to Team' : 'Assign to User'}
                            </button>
                        ))}
                    </div>

                    {/* Team Assignment */}
                    {assignType === 'TEAM' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                Support Team
                            </label>
                            <select
                                value={selectedTeam || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedTeam(value === '' ? undefined : value);
                                }}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            >
                                <option value="">Unassigned</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* User Assignment */}
                    {assignType === 'USER' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                Admin User
                            </label>
                            {isLoadingUsers ? (
                                <div className="px-3 py-2 text-gray-500 bg-white border border-gray-200 rounded-lg text-sm">
                                    Loading users...
                                </div>
                            ) : (
                                <select
                                    value={selectedUser || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSelectedUser(value === '' ? undefined : value);
                                        }}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                                >
                                    <option value="">Unassigned</option>
                                    {adminUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-gray-100 bg-white backdrop-blur-sm hover:bg-gray-50 text-sm rounded-lg transition-all duration-200 py-1.5 px-3"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleAssign}
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                        >
                            Assign
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    };

export default AssignmentModal;
