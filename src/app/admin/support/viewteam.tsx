// pages/support/teams/[id].tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users,
    ChevronLeft,
    Edit,
    Trash2,
    Plus,
    UserPlus,
    AlertTriangle,
    Badge
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Team, TeamFormData } from '../../../types/team';
import { teamService } from '../../../api/services/team';
import { Card, CardContent, CardHeader } from '../../../components/common/Card';
import { Avatar } from '../../../components/common/Avatar';
import { TeamForm } from '../../../components/teams/TeamForm';
import { Modal } from '../../../components/common/Modal';

// Team Member Form Component
const TeamMemberForm: React.FC<{
    onSubmit: (member: { name: string; email: string; role: string }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}> = ({ onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                </label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                >
                    <option value="">Select a role</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Technical Specialist">Technical Specialist</option>
                    <option value="Customer Advocate">Customer Advocate</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Add Member
                </Button>
            </div>
        </form>
    );
};

const viewteam: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [team, setTeam] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchTeam(id);
        }
    }, [id]);

    const fetchTeam = async (teamId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchedTeam = await teamService.getTeam(teamId);
            setTeam(fetchedTeam);
        } catch (err) {
            setError('Failed to fetch team details. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTeam = async (data: TeamFormData) => {
        if (!team) return;

        setIsSubmitting(true);

        try {
            const updatedTeam = await teamService.updateTeam(team.id, data);
            setTeam(updatedTeam);
            setShowEditModal(false);
        } catch (err) {
            setError('Failed to update team. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeam = async () => {
        if (!team) return;

        // Show confirmation dialog
        if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            return;
        }

        setIsLoading(true);

        try {
            await teamService.deleteTeam(team.id);
            navigate('/support/teams');
        } catch (err) {
            setError('Failed to delete team. Please try again later.');
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleAddMember = async (member: { name: string; email: string; role: string }) => {
        if (!team) return;

        setIsSubmitting(true);

        try {
            const newMember = await teamService.addTeamMember(team.id, member);

            // Update team state with new member
            setTeam(prevTeam => {
                if (!prevTeam) return null;
                return {
                    ...prevTeam,
                    members: [...prevTeam.members, newMember]
                };
            });

            setShowAddMemberModal(false);
        } catch (err) {
            setError('Failed to add team member. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!team) return;

        // Show confirmation dialog
        if (!window.confirm('Are you sure you want to remove this team member?')) {
            return;
        }

        setIsLoading(true);

        try {
            await teamService.removeTeamMember(team.id, memberId);

            // Update team state by removing the member
            setTeam(prevTeam => {
                if (!prevTeam) return null;
                return {
                    ...prevTeam,
                    members: prevTeam.members.filter(member => member.id !== memberId)
                };
            });
        } catch (err) {
            setError('Failed to remove team member. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !team) {
        return (
            <>
                <div className="p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </>
        );
    }

    if (!team) {
        return (
            <>
                <div className="p-6">
                    <div className="text-center py-12">
                        <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Team Not Found</h3>
                        <p className="text-gray-500 mb-6">
                            The team you're looking for doesn't exist or has been deleted.
                        </p>
                        <Button
                            onClick={() => navigate('/support/teams')}
                            leftIcon={<ChevronLeft size={16} />}
                        >
                            Back to Teams
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="p-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ChevronLeft size={16} />}
                            onClick={() => navigate('/support/teams')}
                        >
                            Back to Teams
                        </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            leftIcon={<Edit size={16} />}
                            onClick={() => setShowEditModal(true)}
                        >
                            Edit Team
                        </Button>
                        <Button
                            variant="danger"
                            leftIcon={<Trash2 size={16} />}
                            onClick={handleDeleteTeam}
                        >
                            Delete Team
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Users size={20} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                                        <p className="text-gray-900">{team.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                                        <p className="text-gray-900">
                                            {new Date(team.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Team Size</h3>
                                        <div className="flex items-center">
                                            <Badge className="primary">{team.members.length} Members</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
                                    <Button
                                        size="sm"
                                        leftIcon={<UserPlus size={16} />}
                                        onClick={() => setShowAddMemberModal(true)}
                                    >
                                        Add Member
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {team.members.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users size={32} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 mb-4">No team members yet</p>
                                        <Button
                                            leftIcon={<Plus size={16} />}
                                            onClick={() => setShowAddMemberModal(true)}
                                        >
                                            Add First Member
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {team.members.map((member) => (
                                            <div key={member.id} className="py-4 first:pt-0 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Avatar
                                                            src={member.avatar}
                                                            alt={member.name}
                                                            initials={member.name.charAt(0)}
                                                            size="md"
                                                        />
                                                        <div className="ml-3">
                                                            <h3 className="font-medium text-gray-900">{member.name}</h3>
                                                            <div className="text-sm text-gray-500">{member.email}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <Badge className="default">{member.role}</Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            leftIcon={<Trash2 size={14} />}
                                                            onClick={() => handleRemoveMember(member.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Team Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Team"
            >
                <TeamForm
                    team={team}
                    onSubmit={handleUpdateTeam}
                    onCancel={() => setShowEditModal(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Add Member Modal */}
            <Modal
                isOpen={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
                title="Add Team Member"
            >
                <TeamMemberForm
                    onSubmit={handleAddMember}
                    onCancel={() => setShowAddMemberModal(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </>
    );
};

export default viewteam;