import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Calendar,
    Users,
    MessageSquare,
    Edit,
    Trash2,
    UserPlus,
    Share,
    Clock,
    MoreHorizontal,
    Shield,
    Lock,
    Globe,
    X,
    Bell,
    ChevronRight,
    Star,
    Activity
} from 'lucide-react';
import groupService from '../../../../api/services/groups';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

type Member = {
    id: string;
    group_id: string;
    user_id: string | null;
    role: string;
    status: string;
    last_seen: string | null;
    is_muted: boolean;
    is_left: boolean;
    is_removed_by_admin: boolean;
    removed_by_id: string | null;
    is_archived: boolean;
    is_reported: boolean;
    is_blocked: boolean;
    is_favourite: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    user: any | null;
    removed_by: any | null;
};

type Group = {
    id: string;
    title: string;
    description: string;
    icon: string | null;
    type: string;
    status: string;
    created_by: string | null;
    last_message: string | null;
    last_message_sender: string | null;
    last_message_time: string | null;
    last_message_type: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    members: Member[];
};

// Example activity data (since it's not in the API yet)
type Activity = {
    id: string;
    type: 'message' | 'join' | 'leave' | 'update';
    user: string;
    content: string;
    timestamp: string;
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
        return dateString;
    }
};

const formatTime = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
        return dateString;
    }
};

const timeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

type SectionHeaderProps = {
    title: string;
    children?: React.ReactNode;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, children = null }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {children}
    </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex items-center">
        <div className="mr-3 p-3 rounded-xl bg-gradient-to-tr from-primary-50 to-primary-50 text-primary-600">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const groupdetail: React.FC = () => {
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                setLoading(true);

                if (!id) {
                    throw new Error('Group ID is undefined');
                }
                const response = await groupService.getGroupById(id);
                setGroup(response);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch group:', error);
                setError('Failed to load group details');
                setLoading(false);
            }
        };

        fetchGroup();
    }, [id]);

    const handleDeleteGroup = async () => {
        try {
            if (id) {
                await groupService.deleteGroup(id);
            } else {
                throw new Error('Group ID is undefined');
            }
            navigate(-1);
        } catch (error) {
            console.error('Failed to delete group:', error);
            setError('Failed to delete group');
        }
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setShowActionsMenu(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="w-64 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
                                <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                                <div className="w-1/2 h-6 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="space-y-4">
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-md p-8 max-w-md backdrop-blur-sm bg-opacity-95">
                    <div className="text-red-500 text-center mb-6">
                        <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <X size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Error</h2>
                    </div>
                    <p className="text-gray-600 mb-8 text-center">{error}</p>
                    <div className="flex justify-center">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300"
                            onClick={() => navigate(-1)}
                        >
                            Back to Groups
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!group) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <Trash2 size={28} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold">Delete Group</h3>
                            <p className="mt-3 text-gray-600">
                                Are you sure you want to delete "{group.title}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={() => setDeleteConfirmation(false)}
                                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteGroup}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow transition-all duration-300 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                        >
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{group.title}</h1>
                            <p className="text-gray-500 mt-1">{group.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${group.type === 'public' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700' : 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700'
                                }`}>
                                {group.type === 'public' ? <Globe size={14} className="mr-1" /> : <Lock size={14} className="mr-1" />}
                                {group.type}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${group.status === 'active' ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                                }`}>
                                {group.status}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Created {formatDate(group.createdAt)}
                            </span>
                        </div>
                        <div className="flex mt-3 md:mt-0">
                            <div className="relative">
                                {showActionsMenu && (
                                    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden">
                                        <div className="py-1">
                                            <button
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                                                onClick={() => {
                                                    setShowActionsMenu(false);
                                                    // Handle edit
                                                }}
                                            >
                                                <Edit size={16} className="mr-3 text-gray-500" />
                                                Edit Group
                                            </button>
                                            <button
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                                                onClick={() => {
                                                    setShowActionsMenu(false);
                                                    // Handle share
                                                }}
                                            >
                                                <Share size={16} className="mr-3 text-gray-500" />
                                                Share Group
                                            </button>
                                            <button
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                                                onClick={() => {
                                                    setShowActionsMenu(false);
                                                    setDeleteConfirmation(true);
                                                }}
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete Group
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-100 bg-white bg-opacity-90 backdrop-blur-sm sticky top-24 z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex overflow-x-auto">
                        <button
                            className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'overview'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'members'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('members')}
                        >
                            Members
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Group Summary" />
                                <p className="text-gray-600 mb-6">{group.description}</p>

                                <div className="flex flex-wrap gap-6 mb-6">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Calendar size={16} className="mr-2 text-primary-500" />
                                        <span>Created on {formatDate(group.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Users size={16} className="mr-2 text-primary-500" />
                                        <span>{group.members ? group.members.length : 0} members</span>
                                    </div>
                                    {group.last_message && (
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MessageSquare size={16} className="mr-2 text-primary-500" />
                                            <span>Last message: {timeAgo(group.last_message_time || '')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Group Stats" />
                                <div className="space-y-4">
                                    <StatCard
                                        icon={<Users size={20} className="text-primary-600" />}
                                        label="Members"
                                        value={group.members ? group.members.length : 0}
                                    />
                                    <StatCard
                                        icon={<MessageSquare size={20} className="text-primary-600" />}
                                        label="Total Messages"
                                        value={group.last_message ? 1 : 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">
                                    Members ({group.members ? group.members.length : 0})
                                </h2>
                            </div>
                        </div>

                        {group.members && group.members.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/80">
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider">
                                                Member
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider">
                                                Joined
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {group.members.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50/50 transition-colors duration-300">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-100 flex items-center justify-center text-primary-600 mr-3">
                                                            {member.user ? member.user.username?.charAt(0) : 'M'}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.user ? member.user.username : 'Member'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'admin' ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700' :
                                                        member.role === 'moderator' ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700' :
                                                            'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                                                        }`}>
                                                        {member.role === 'admin' && <Shield size={12} className="mr-1" />}
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                                                        }`}>
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {moment(member.createdAt)?.format('MMM DD, YYYY, h:mm A')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-4">
                                    <Users size={24} className="text-primary-500" />
                                </div>
                                <p className="text-gray-600 mb-4">No members found in this group.</p>
                                <button className="px-5 py-2.5 bg-primary-100 text-primary-600 rounded-xl font-medium hover:bg-primary-200 transition-colors duration-300">
                                    <UserPlus size={16} className="inline mr-2" />
                                    Add Members
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default groupdetail;