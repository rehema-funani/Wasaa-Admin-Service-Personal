import React, { useState, useEffect } from 'react';
import { X, Users, Briefcase, Check, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
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
    const [formData, setFormData] = useState<any>({
        title: '',
        level: 'LEVEL_1',
        members: []
    });
    const [adminUsers, setAdminUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (team) {
            setFormData({
                title: team.title,
                level: team.level || 'LEVEL_1',
                members: team.members || []
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
            console.error(err);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Team Name
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Users size={18} />
                    </div>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter team name"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Support Level
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Briefcase size={18} />
                    </div>
                    <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    >
                        <option value="LEVEL_1">Level 1 - First Line Support</option>
                        <option value="LEVEL_2">Level 2 - Technical Support</option>
                        <option value="LEVEL_3">Level 3 - Expert Support</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl p-4"
            >
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                        Team Members
                    </label>
                    {isLoadingUsers && (
                        <div className="text-xs text-gray-500">Loading users...</div>
                    )}
                </div>

                {error && (
                    <div className="text-sm text-red-500 mb-3">
                        {error}
                    </div>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {adminUsers.length === 0 && !isLoadingUsers ? (
                        <div className="text-sm text-gray-500 text-center py-4">
                            No admin users found
                        </div>
                    ) : (
                        adminUsers.map(user => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-2.5 border ${formData.members.includes(user.id)
                                    ? 'border-blue-200 bg-blue-50/80'
                                    : 'border-gray-100 hover:border-gray-200'
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
                                    <div className="ml-2.5">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>

                                {formData.members.includes(user.id) && (
                                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                        <Check size={12} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {!isLoadingUsers && adminUsers.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500">
                        Selected: {formData.members.length} of {adminUsers.length} users
                    </div>
                )}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex justify-end gap-3 pt-5"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="border-gray-200/80 bg-white/70 backdrop-blur-sm hover:bg-gray-50/90 rounded-xl transition-all duration-200"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="bg-blue-500/90 hover:bg-blue-600/90 text-white rounded-xl shadow-sm shadow-blue-500/20 transition-all duration-200"
                    rightIcon={team ? <Check size={16} /> : <UserPlus size={16} />}
                >
                    {team ? 'Update Team' : 'Create Team'}
                </Button>
            </motion.div>
        </motion.form>
    );
};