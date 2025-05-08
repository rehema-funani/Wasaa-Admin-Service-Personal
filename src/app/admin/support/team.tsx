import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team, TeamFormData } from '../../../types/team';
import { teamService } from '../../../api/services/team';
import { TeamList } from '../../../components/teams/TeamList';
import { TeamForm } from '../../../components/teams/TeamForm';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TeamPage: React.FC = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
    const [isDeletingTeam, setIsDeletingTeam] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchedTeams = await teamService.getTeams();
            setTeams(fetchedTeams.teams);
        } catch (err) {
            setError('Failed to fetch teams. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTeam = () => {
        setShowAddModal(true);
    };

    const handleEditTeam = (team: Team) => {
        setCurrentTeam(team);
        setShowEditModal(true);
    };

    const handleInitiateDelete = (id: string) => {
        const team = teams.find(team => team.id === id);
        setCurrentTeam(team || null);
        setTeamToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!teamToDelete) return;

        setIsDeletingTeam(true);

        try {
            await teamService.deleteTeam(teamToDelete);
            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamToDelete));
            setShowDeleteModal(false);
            toast.success('Team deleted successfully');
        } catch (err) {
            setError('Failed to delete team. Please try again later.');
            console.error(err);
            toast.error('Failed to delete team');
        } finally {
            setIsDeletingTeam(false);
            setTeamToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setTeamToDelete(null);
        setCurrentTeam(null);
    };

    const handleViewTeamDetails = (id: string) => {
        navigate(`/admin/support/teams/${id}`);
    };

    const handleCreateTeam = async (data: TeamFormData) => {
        setIsSubmitting(true);

        try {
            const newTeam = await teamService.createTeam(data);
            setTeams(prevTeams => [...prevTeams, newTeam]);
            setShowAddModal(false);
            toast.success('Team created successfully!');
        } catch (err) {
            setError('Failed to create team. Please try again later.');
            console.error(err);
            toast.error('Failed to create team');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTeam = async (data: TeamFormData) => {
        if (!currentTeam) return;

        setIsSubmitting(true);

        try {
            const updatedTeam = await teamService.updateTeam(currentTeam.id, data);
            setTeams(prevTeams =>
                prevTeams.map(team =>
                    team.id === updatedTeam.id ? updatedTeam : team
                )
            );
            setShowEditModal(false);
            toast.success('Team updated successfully!');
            fetchTeams();
        } catch (err) {
            setError('Failed to update team. Please try again later.');
            console.error(err);
            toast.error('Failed to update team');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <div className="bg-red-50/70 backdrop-blur-sm border border-red-100/70 text-red-600 px-4 py-2.5 rounded-lg mx-5 my-4 text-sm">
                    {error}
                </div>
            )}

            <TeamList
                teams={teams}
                isLoading={isLoading}
                onAddTeam={handleAddTeam}
                onEditTeam={handleEditTeam}
                onDeleteTeam={handleInitiateDelete}
                onViewTeamDetails={handleViewTeamDetails}
            />

            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Team"
            >
                <TeamForm
                    onSubmit={handleCreateTeam}
                    onCancel={() => setShowAddModal(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Team"
            >
                {currentTeam && (
                    <TeamForm
                        team={currentTeam}
                        onSubmit={handleUpdateTeam}
                        onCancel={() => setShowEditModal(false)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

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
                                This will permanently delete <span className="font-semibold">{currentTeam?.title}</span> and remove all associated data. This action cannot be undone.
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
        </>
    );
};

export default TeamPage;