import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Check, UserPlus } from 'lucide-react';
import { Button } from '../common/Button';
import { Team, TeamFormData } from '../../types/team';
import { Avatar } from '../common/Avatar';
import userService from '../../api/services/users';

interface TeamFormProps {
    team?: Team;
    onSubmit: (data: TeamFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
    team,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState<TeamFormData>({
        title: '',
        level: 'LEVEL_1',
        members: []
    });
    const [adminUsers, setAdminUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (team) {
            const normalizedMembers = team.members?.map(member => {
                if (typeof member === 'string') return member;
                if (member && typeof member === 'object' && 'member' in member) {
                    return member.member;
                }
                return null;
            }).filter(Boolean) as string[];

            setFormData({
                title: team.title,
                level: team.level || 'LEVEL_1',
                members: normalizedMembers || []
            });
        }
        fetchAdminUsers();
    }, [team]);

    const fetchAdminUsers = async () => {
        setIsLoadingUsers(true);
        setError(null);
        try {
            const users = await userService.getAdminUsers();
            setAdminUsers(users.users);
        } catch (err) {
            setError('Failed to load admin users');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: TeamFormData) => ({ ...prev, [name]: value }));
    };

    const handleMemberToggle = (userId: string) => {
        setFormData((prev: TeamFormData) => {
            const isSelected: boolean = prev.members.includes(userId);
            return {
                ...prev,
                members: isSelected
                    ? prev.members.filter((id: string) => id !== userId)
                    : [...prev.members, userId]
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 opacity-100 transition-opacity duration-300"
        >
            <div className="opacity-100 transform translate-y-0 transition-all duration-300">
                <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1.5">
                    Team Name
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Users size={16} />
                    </div>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all duration-200"
                        placeholder="Enter team name"
                    />
                </div>
            </div>

            <div className="opacity-100 transform translate-y-0 transition-all duration-300">
                <label htmlFor="level" className="block text-xs font-medium text-gray-600 mb-1.5">
                    Support Level
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Briefcase size={16} />
                    </div>
                    <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full pl-9 pr-9 py-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg appearance-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent transition-all duration-200"
                    >
                        <option value="LEVEL_1">Level 1 - First Line Support</option>
                        <option value="LEVEL_2">Level 2 - Technical Support</option>
                        <option value="LEVEL_3">Level 3 - Expert Support</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <div
                className="bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-lg p-3 opacity-100 transform translate-y-0 transition-all duration-300 shadow-sm"
            >
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">
                        Team Members
                    </label>
                    {isLoadingUsers && (
                        <div className="text-xs text-gray-500">Loading users...</div>
                    )}
                </div>

                {error && (
                    <div className="text-xs text-red-500 mb-2">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1.5">
                    {adminUsers.length === 0 && !isLoadingUsers ? (
                        <div className="text-xs text-gray-500 text-center py-3">
                            No admin users found
                        </div>
                    ) : (
                        adminUsers.map(user => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-2 border ${formData.members.includes(user.id)
                                    ? 'border-primary-100/70 bg-primary-50/50'
                                    : 'border-gray-100/60 hover:border-gray-200/70 hover:bg-gray-50/50'
                                    } rounded-lg cursor-pointer transition-all duration-200`}
                                onClick={() => handleMemberToggle(user.id)}
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

                                {formData.members.includes(user.id) && (
                                    <div className="h-4 w-4 bg-primary-500 rounded-full flex items-center justify-center text-white">
                                        <Check size={10} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {!isLoadingUsers && adminUsers.length > 0 && (
                    <div className="mt-2 text-[11px] text-gray-500">
                        Selected: {formData.members.length} of {adminUsers.length} users
                    </div>
                )}
            </div>

            <div
                className="flex justify-end gap-2 pt-4 opacity-100 transform translate-y-0 transition-all duration-300"
            >
                <Button
                    type="button"
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
                    disabled={isSubmitting}
                    className="bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg shadow-sm transition-all duration-200 py-1.5 px-3"
                    rightIcon={team ? <Check size={14} /> : <UserPlus size={14} />}
                >
                    {team ? 'Update Team' : 'Create Team'}
                </Button>
            </div>

            <style>{`
                /* iOS 18-like glass morphism */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
                
                /* Add fade-in effect for staggered appearance */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                form > div {
                    animation: fadeInUp 0.3s ease-out both;
                }
                
                form > div:nth-child(1) {
                    animation-delay: 0.05s;
                }
                
                form > div:nth-child(2) {
                    animation-delay: 0.1s;
                }
                
                form > div:nth-child(3) {
                    animation-delay: 0.15s;
                }
                
                form > div:nth-child(4) {
                    animation-delay: 0.2s;
                }
            `}</style>
        </form>
    );
};