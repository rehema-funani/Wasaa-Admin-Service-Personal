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
    X,
    Shield,
    Headphones,
    Server,
    Check,
    UserCog,
    Search
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Team, TeamFormData } from '../../../types/team';
import { teamService } from '../../../api/services/team';
import { Card, CardContent, CardHeader } from '../../../components/common/Card';
import { Avatar } from '../../../components/common/Avatar';
import { TeamForm } from '../../../components/teams/TeamForm';
import { Modal } from '../../../components/common/Modal';
import userService from '../../../api/services/users';
import toast from 'react-hot-toast';

// Support level information
const SUPPORT_LEVELS = {
    LEVEL_1: {
        title: "Level 1 - First Line Support",
        description: "Handles initial customer inquiries, ticket creation, and basic troubleshooting. Escalates complex issues to higher support levels.",
        icon: <Headphones size={16} className="text-blue-500" />
    },
    LEVEL_2: {
        title: "Level 2 - Technical Support",
        description: "Addresses more complex technical issues and performs detailed analysis. Has deeper product knowledge and troubleshooting skills.",
        icon: <UserCog size={16} className="text-indigo-500" />
    },
    LEVEL_3: {
        title: "Level 3 - Expert Support",
        description: "Highest level of technical expertise. Handles the most complex issues, bugs, and may work directly with product development team.",
        icon: <Server size={16} className="text-purple-500" />
    }
};

const TeamMemberForm: React.FC<{
    onSubmit: (member: { userId: string; role: string }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    teamId: string;
}> = ({ onSubmit, onCancel, isSubmitting, teamId }) => {
    const [formData, setFormData] = useState({
        userId: '',
        role: ''
    });
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    useEffect(() => {
        fetchAvailableUsers();
    }, [teamId]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredUsers(
                users.filter(
                    user =>
                        user.name.toLowerCase().includes(query) ||
                        user.email.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, users]);

    const fetchAvailableUsers = async () => {
        setIsLoadingUsers(true);
        setError(null);
        try {
            const response = await userService.getAdminUsers();

            setUsers(response.users || []);
            setFilteredUsers(response.users || []);
        } catch (err) {
            setError('Failed to load available users');
            console.error(err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleUserSelect = (user: any) => {
        setSelectedUser(user);
        setFormData(prev => ({ ...prev, userId: user.id }));
        setSearchQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.userId) {
            toast.error('Please select a user');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Select User
                </label>
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200"
                    />
                </div>

                {error && (
                    <div className="text-xs text-red-500 mb-2">
                        {error}
                    </div>
                )}

                <div className="bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg shadow-sm overflow-hidden mb-4">
                    <div className="max-h-48 overflow-y-auto">
                        {isLoadingUsers ? (
                            <div className="p-3 text-xs text-gray-500 text-center">
                                Loading users...
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-3 text-xs text-gray-500 text-center">
                                No users found
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`flex items-center justify-between p-2 border-b border-gray-100/50 last:border-b-0 cursor-pointer
                                        ${selectedUser?.id === user.id
                                            ? 'bg-blue-50/50 border-blue-100/50'
                                            : 'hover:bg-gray-50/50'
                                        } transition-colors duration-200`}
                                >
                                    <div className="flex items-center">
                                        <Avatar
                                            src={user.avatar}
                                            alt={user.name}
                                            initials={user.name?.[0] || '?'}
                                            size="sm"
                                        />
                                        <div className="ml-2">
                                            <div className="text-xs font-medium text-gray-900">{user.name}</div>
                                            <div className="text-[11px] text-gray-500">{user.email}</div>
                                        </div>
                                    </div>

                                    {selectedUser?.id === user.id && (
                                        <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            <Check size={10} />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="border-gray-100/70 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 text-sm rounded-lg transition-all duration-200 py-1.5 px-3"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !selectedUser}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                    rightIcon={<UserPlus size={14} />}
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<any>(null);
    const [isDeletingTeam, setIsDeletingTeam] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);
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
            toast.success('Team updated successfully!');
        } catch (err) {
            setError('Failed to update team. Please try again later.');
            console.error(err);
            toast.error('Failed to update team');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInitiateDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!team) return;

        setIsDeletingTeam(true);

        try {
            await teamService.deleteTeam(team.id);
            toast.success('Team deleted successfully');
            navigate('/support/teams');
        } catch (err) {
            setError('Failed to delete team. Please try again later.');
            console.error(err);
            toast.error('Failed to delete team');
            setIsDeletingTeam(false);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleAddMember = async (data: { userId: string; role: string }) => {
        if (!team) return;

        setIsSubmitting(true);

        try {
            const newMember = await teamService.addTeamMember(team.id, data.userId);

            setTeam(prevTeam => {
                if (!prevTeam) return null;
                return {
                    ...prevTeam,
                    members: [...prevTeam.members, newMember]
                };
            });

            setShowAddMemberModal(false);
            toast.success('Team member added successfully!');
        } catch (err) {
            setError('Failed to add team member. Please try again later.');
            console.error(err);
            toast.error('Failed to add team member');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInitiateRemoveMember = (member: any) => {
        setMemberToRemove(member);
        setShowRemoveMemberModal(true);
    };

    const handleConfirmRemoveMember = async () => {
        if (!team || !memberToRemove) return;

        setIsRemovingMember(true);

        try {
            await teamService.removeTeamMember(team.id, memberToRemove.id);

            setTeam(prevTeam => {
                if (!prevTeam) return null;
                return {
                    ...prevTeam,
                    members: prevTeam.members.filter(member => member.id !== memberToRemove.id)
                };
            });

            setShowRemoveMemberModal(false);
            setMemberToRemove(null);
            toast.success('Team member removed successfully');
        } catch (err) {
            setError('Failed to remove team member. Please try again later.');
            console.error(err);
            toast.error('Failed to remove team member');
        } finally {
            setIsRemovingMember(false);
        }
    };

    const handleCancelRemoveMember = () => {
        setShowRemoveMemberModal(false);
        setMemberToRemove(null);
    };

    if (isLoading && !team) {
        return (
            <div className="p-5">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-40 bg-gray-100 rounded"></div>
                    <div className="h-56 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="p-5">
                <div className="text-center py-10 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100/70 shadow-sm">
                    <div className="bg-red-50/50 p-3 rounded-lg w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Not Found</h3>
                    <p className="text-gray-500 text-sm mb-5">
                        The team you're looking for doesn't exist or has been deleted.
                    </p>
                    <Button
                        onClick={() => navigate(-1)}
                        leftIcon={<ChevronLeft size={14} />}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                    >
                        Back to Teams
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-5">
                {error && (
                    <div className="bg-red-50/70 backdrop-blur-sm border border-red-100/70 text-red-600 px-4 py-2.5 rounded-lg mx-5 my-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ChevronLeft size={14} />}
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 text-sm py-1.5 rounded-lg transition-colors duration-200"
                        >
                            Back to Teams
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            leftIcon={<Edit size={14} />}
                            onClick={() => setShowEditModal(true)}
                            className="border-gray-100/70 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 text-sm rounded-lg transition-all duration-200 py-1.5 px-3"
                        >
                            Edit Team
                        </Button>
                        <Button
                            variant="danger"
                            leftIcon={<Trash2 size={14} />}
                            onClick={handleInitiateDelete}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                        >
                            Delete Team
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-1">
                        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm h-full">
                            <CardHeader className="border-b border-gray-100/50 pb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-50/80 p-2 rounded-lg ring-1 ring-blue-100/50">
                                        <Users size={16} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">{team.title}</h2>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Support Level</h3>
                                        <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100/50">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                {SUPPORT_LEVELS[team.level as keyof typeof SUPPORT_LEVELS]?.icon || <Shield size={16} className="text-blue-500" />}
                                                <span className="font-medium text-sm">
                                                    {SUPPORT_LEVELS[team.level as keyof typeof SUPPORT_LEVELS]?.title || team.level}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {SUPPORT_LEVELS[team.level as keyof typeof SUPPORT_LEVELS]?.description ||
                                                    "Supports customers with product issues and inquiries."}
                                            </p>
                                        </div>
                                    </div>

                                    {team.description && (
                                        <div>
                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</h3>
                                            <p className="text-sm text-gray-700">{team.description}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Created</h3>
                                        <p className="text-sm text-gray-700">
                                            {new Date(team.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Team Size</h3>
                                        <div className="flex items-center">
                                            <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-100/50">
                                                {team.members?.length || 0} Members
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                            <CardHeader className="border-b border-gray-100/50 pb-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-medium text-gray-900">Team Members</h2>
                                    <Button
                                        size="sm"
                                        leftIcon={<UserPlus size={14} />}
                                        onClick={() => setShowAddMemberModal(true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg shadow-sm transition-all duration-200 py-1 px-2.5"
                                    >
                                        Add Member
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-3">
                                {!team.members || team.members.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users size={28} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm mb-3">No team members yet</p>
                                        <Button
                                            leftIcon={<Plus size={14} />}
                                            onClick={() => setShowAddMemberModal(true)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                                        >
                                            Add First Member
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100/70">
                                        {team.members.map((member) => (
                                            <div key={member.id} className="py-3 first:pt-0 last:pb-0 transition-colors duration-200 hover:bg-blue-50/20 px-2 -mx-2 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Avatar
                                                            src={member.avatar}
                                                            alt={member.name}
                                                            initials={member?.user?.first_name.charAt(0)}
                                                            size="sm"
                                                            className="border border-gray-100"
                                                        />
                                                        <div className="ml-3">
                                                            <h3 className="font-medium text-gray-900 text-sm">{member?.user?.first_name} {member?.user?.last_name}</h3>
                                                            <div className="text-xs text-gray-500">{member?.user?.email}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <div className="bg-gray-50 text-gray-600 text-xs font-medium px-2 py-0.5 rounded border border-gray-100/50">
                                                            {member.role || 'Support Agent'}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleInitiateRemoveMember(member)}
                                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50/50 p-1 rounded-lg transition-colors duration-200"
                                                        >
                                                            <Trash2 size={14} />
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

            <Modal
                isOpen={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
                title="Add Team Member"
            >
                {team && (
                    <TeamMemberForm
                        onSubmit={handleAddMember}
                        onCancel={() => setShowAddMemberModal(false)}
                        isSubmitting={isSubmitting}
                        teamId={team.id}
                    />
                )}
            </Modal>

            {/* Delete Team Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                title="Delete Team"
                size="sm"
            >
                <div className="p-1">
                    <div className="flex items-start mb-4">
                        <div className="bg-red-50 p-2 rounded-lg mr-3">
                            <AlertTriangle size={20} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-1">
                                Are you sure?
                            </h3>
                            <p className="text-sm text-gray-600">
                                This will permanently delete <span className="font-semibold">{team.title}</span> and remove all associated data. This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelDelete}
                            disabled={isDeletingTeam}
                            className="border-gray-100 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 text-sm rounded-lg transition-all duration-200 py-1.5 px-3"
                            leftIcon={<X size={14} />}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            isLoading={isDeletingTeam}
                            disabled={isDeletingTeam}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                            leftIcon={<Trash2 size={14} />}
                        >
                            Delete Team
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Remove Member Confirmation Modal */}
            <Modal
                isOpen={showRemoveMemberModal}
                onClose={handleCancelRemoveMember}
                title="Remove Team Member"
                size="sm"
            >
                <div className="p-1">
                    <div className="flex items-start mb-4">
                        <div className="bg-red-50 p-2 rounded-lg mr-3">
                            <AlertTriangle size={20} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-1">
                                Remove team member?
                            </h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to remove <span className="font-semibold">{memberToRemove?.name}</span> from this team?
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelRemoveMember}
                            disabled={isRemovingMember}
                            className="border-gray-100 bg-white/90 backdrop-blur-sm hover:bg-gray-50/90 text-sm rounded-lg transition-all duration-200 py-1.5 px-3"
                            leftIcon={<X size={14} />}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmRemoveMember}
                            isLoading={isRemovingMember}
                            disabled={isRemovingMember}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                            leftIcon={<Trash2 size={14} />}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            </Modal>

            <style>{`
                /* iOS 18-like glass morphism */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
            `}</style>
        </>
    );
};

export default viewteam;