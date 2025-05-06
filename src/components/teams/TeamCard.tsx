
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Team } from '../../types/team';

interface TeamCardProps {
    team: Team;
    onEdit: (team: Team) => void;
    onDelete: (id: string) => void;
    onViewDetails: (id: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    team,
    onEdit,
    onDelete,
    onViewDetails
}) => {
    const [showOptions, setShowOptions] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Users size={20} className="text-blue-600" />
                        </div>
                        <h3 className="ml-3 font-medium text-gray-900">{team.title}</h3>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 mt-1 py-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                                <button
                                    onClick={() => {
                                        onEdit(team);
                                        setShowOptions(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                    <Edit size={14} className="mr-2 text-gray-500" />
                                    Edit Team
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(team.id);
                                        setShowOptions(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                >
                                    <Trash2 size={14} className="mr-2 text-red-500" />
                                    Delete Team
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-3 text-sm text-gray-500 line-clamp-2">{team.description}</p>

                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Team Members</span>
                        <Badge size="sm" variant="primary">{team.members.length}</Badge>
                    </div>

                    <div className="mt-2 flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 5).map((member) => (
                            <Avatar
                                key={member?.id}
                                src={member?.avatar}
                                alt={member?.user?.first_name}
                                initials={member?.user?.first_name.charAt(0)}
                                size="sm"
                                className="border-2 border-white"
                            />
                        ))}
                        {team.members.length > 5 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs text-gray-600 font-medium">
                                +{team.members.length - 5}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onViewDetails(team.id)}
                    className="mt-4 w-full py-2 text-sm text-center text-blue-600 font-medium border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    View Details
                </button>
            </div>
        </motion.div>
    );
};
