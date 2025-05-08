import React, { useState } from 'react';
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
            <div className="p-5">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-9 bg-gray-100 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="h-56 bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                    <Users size={20} className="text-blue-600 mr-2" />
                    <h1 className="text-xl font-semibold text-gray-900">Support Teams</h1>
                </div>
                <Button
                    onClick={onAddTeam}
                    leftIcon={<Plus size={16} />}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg transition-colors duration-200"
                >
                    Add Team
                </Button>
            </div>

            <Card className="mb-5 bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                <div className="relative p-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    />
                </div>
            </Card>

            {filteredTeams.length === 0 ? (
                <div className="text-center py-10 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100/70 shadow-sm">
                    <Users size={40} className="text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">No teams found</h3>
                    <p className="text-gray-500 text-sm">
                        {searchQuery ? 'Try adjusting your search query' : 'Create your first team to get started'}
                    </p>
                    {!searchQuery && (
                        <Button
                            onClick={onAddTeam}
                            leftIcon={<Plus size={14} />}
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-lg transition-colors duration-200"
                        >
                            Add Team
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeams.map((team) => (
                        <div
                            key={team.id}
                            className="transition-all duration-200 opacity-100"
                        >
                            <TeamCard
                                team={team}
                                onEdit={onEditTeam}
                                onDelete={onDeleteTeam}
                                onViewDetails={onViewTeamDetails}
                            />
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                /* iOS 18-like glass morphism */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
            `}</style>
        </div>
    );
};