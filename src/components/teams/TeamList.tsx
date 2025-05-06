
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import { TeamCard } from './TeamCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Team } from '../../types/team';

interface TeamListProps {
    teams: Team[];
    isLoading: boolean;
    onAddTeam: () => void;
    onEditTeam: (team: Team) => void;
    onDeleteTeam: (id: string) => void;
    onViewTeamDetails: (id: string) => void;
}

export const TeamList: React.FC<TeamListProps> = ({
    teams,
    isLoading,
    onAddTeam,
    onEditTeam,
    onDeleteTeam,
    onViewTeamDetails
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTeams = teams.filter(team =>
        team?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="h-64 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Users size={24} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-semibold text-gray-900">Support Teams</h1>
                </div>
                <Button
                    onClick={onAddTeam}
                    leftIcon={<Plus size={18} />}
                >
                    Add Team
                </Button>
            </div>

            <Card className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </Card>

            {filteredTeams.length === 0 ? (
                <div className="text-center py-12">
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No teams found</h3>
                    <p className="text-gray-500">
                        {searchQuery ? 'Try adjusting your search query' : 'Create your first team to get started'}
                    </p>
                    {!searchQuery && (
                        <Button
                            onClick={onAddTeam}
                            leftIcon={<Plus size={16} />}
                            className="mt-4"
                        >
                            Add Team
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTeams.map((team) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onEdit={onEditTeam}
                                onDelete={onDeleteTeam}
                                onViewDetails={onViewTeamDetails}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};