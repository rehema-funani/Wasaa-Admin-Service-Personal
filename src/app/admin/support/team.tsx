import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team, TeamFormData } from '../../../types/team';
import { teamService } from '../../../api/services/team';
import { TeamList } from '../../../components/teams/TeamList';
import { TeamForm } from '../../../components/teams/TeamForm';
import { Modal } from '../../../components/common/Modal';

const team: React.FC = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
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

    const handleDeleteTeam = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this team?')) {
            return;
        }

        setIsLoading(true);

        try {
            await teamService.deleteTeam(id);
            setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
        } catch (err) {
            setError('Failed to delete team. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewTeamDetails = (id: string) => {
        navigate(`/support/teams/${id}`);
    };

    const handleCreateTeam = async (data: TeamFormData) => {
        setIsSubmitting(true);

        try {
            const newTeam = await teamService.createTeam(data);
            setTeams(prevTeams => [...prevTeams, newTeam]);
            setShowAddModal(false);
        } catch (err) {
            setError('Failed to create team. Please try again later.');
            console.error(err);
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
        } catch (err) {
            setError('Failed to update team. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-6">
                    {error}
                </div>
            )}

            <TeamList
                teams={teams}
                isLoading={isLoading}
                onAddTeam={handleAddTeam}
                onEditTeam={handleEditTeam}
                onDeleteTeam={handleDeleteTeam}
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
        </>
    );
};

export default team;