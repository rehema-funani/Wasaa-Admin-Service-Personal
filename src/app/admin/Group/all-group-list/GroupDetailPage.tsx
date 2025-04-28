import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Share2,
    Users,
    TrendingUp,
    ArrowUpRight,
    Calendar,
    Clock,
    MessageCircle,
    FileText,
    Link2,
    Settings,
    Mail,
    Plus,
    UserPlus,
    UserCheck,
    MessageSquare,
    BarChart3,
    LineChart as LineChartIcon,
    Layers,
    UserMinus,
    Lock,
    Globe,
    Smartphone,
    Laptop,
    UsersRound,
    Tablet
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const GroupDetailPage = () => {
    const [group] = useState({
        id: '3',
        name: 'Engineering Team',
        description: 'Software engineering and development collaboration space for the engineering department.',
        memberCount: 45,
        activeMembers: 38,
        admin: 'Noah Martinez',
        adminEmail: 'noah.martinez@example.com',
        type: 'private',
        createdAt: 'Nov 8, 2023',
        lastActive: '20 minutes ago',
        status: 'active',
        postsCount: 583,
        engagementRate: 93,
        growthRate: 4.2,
        documentCount: 87,
        taskCount: 132,
        completedTasks: 97,
        meetingsCount: 42,
        upcomingMeetings: 3,
        tags: ['Development', 'Backend', 'Frontend', 'DevOps', 'QA'],
        channels: [
            { name: 'general', messageCount: 248, lastActive: '5 minutes ago' },
            { name: 'backend', messageCount: 187, lastActive: '1 hour ago' },
            { name: 'frontend', messageCount: 156, lastActive: '30 minutes ago' },
            { name: 'devops', messageCount: 92, lastActive: '2 hours ago' },
            { name: 'qa', messageCount: 84, lastActive: '3 hours ago' }
        ],
        accessLevel: 'department',
        memberStats: {
            activeToday: 32,
            activeThisWeek: 38,
            notActive: 7,
            roles: {
                admin: 1,
                moderator: 4,
                member: 40
            },
            newThisMonth: 5,
            byDepartment: [
                { name: 'Backend', count: 18 },
                { name: 'Frontend', count: 12 },
                { name: 'DevOps', count: 8 },
                { name: 'QA', count: 7 }
            ]
        },
        activityMetrics: {
            messagesByDay: [125, 98, 142, 167, 113, 78, 42],
            messagesByHour: [
                { hour: '12am', count: 8 },
                { hour: '3am', count: 4 },
                { hour: '6am', count: 12 },
                { hour: '9am', count: 42 },
                { hour: '12pm', count: 68 },
                { hour: '3pm', count: 54 },
                { hour: '6pm', count: 31 },
                { hour: '9pm', count: 17 }
            ],
            deviceUsage: { mobile: 65, desktop: 30, tablet: 5 },
            topReactions: [
                { type: '👍', count: 245 },
                { type: '❤️', count: 186 },
                { type: '🎉', count: 124 },
                { type: '🚀', count: 98 },
                { type: '👏', count: 75 }
            ]
        },
        recentPosts: [
            {
                id: 'p1',
                author: 'Noah Martinez',
                content: 'Team, I\'ve pushed the latest changes to the API endpoints.Please review and test on your local environment.',
                timestamp: '35 minutes ago',
                reactions: 12,
                comments: 5
            },
            {
                id: 'p2',
                author: 'Emma Johnson',
                content: 'The frontend changes for the dashboard redesign are ready for review. Check out the PR #245.',
                timestamp: '2 hours ago',
                reactions: 8,
                comments: 3
            },
            {
                id: 'p3',
                author: 'Liam Wilson',
                content: 'DevOps update: We\'ve upgraded the CI/ CD pipeline with the latest version of Jenkins.Builds should be faster now.',
                timestamp: '4 hours ago',
                reactions: 15,
                comments: 7
            }
        ]
    });

    const [timeframe, setTimeframe] = useState('week');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedTab, setSelectedTab] = useState('members');

    // Mock data for members and activity
    const [groupMembers, setGroupMembers] = useState<any[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);

    // Generate mock members data
    const generateMembersData = () => {
        const members = [];
        const names = [
            'Noah Martinez', 'Emma Johnson', 'Liam Wilson', 'Olivia Davis',
            'Sophia Garcia', 'Jackson Brown', 'Ava Martinez', 'Lucas Miller',
            'Isabella Taylor', 'Oliver Williams', 'Amelia Jones', 'Ethan Davis',
            'Charlotte Smith', 'Henry Johnson', 'Mia Rodriguez', 'Alexander Wilson'
        ];

        const roles = ['Admin', 'Moderator', 'Moderator', 'Moderator', 'Moderator'];

        // Fill the rest with regular members
        for (let i = 0; i < 16; i++) {
            members.push({
                id: `m${i + 1}`,
                name: names[i],
                email: names[i].toLowerCase().replace(' ', '.') + '@example.com',
                role: i < 5 ? roles[i] : 'Member',
                joinDate: `${Math.floor(Math.random() * 12) + 1} ${Math.random() > 0.5 ? 'months' : 'weeks'} ago`,
                lastActive: i < 35 ? `${Math.floor(Math.random() * 24) + 1} ${Math.random() > 0.7 ? 'hours' : 'minutes'} ago` : `${Math.floor(Math.random() * 7) + 1} days ago`,
                postsCount: Math.floor(Math.random() * 50) + 1,
                status: i < 38 ? 'active' : 'inactive',
                department: ['Backend', 'Frontend', 'DevOps', 'QA'][Math.floor(Math.random() * 4)]
            });
        }

        return members;
    };

    // Generate activity data based on timeframe
    const generateActivityData = (period: string) => {
        let data = [];
        let points = 0;

        switch (period) {
            case 'week':
                points = 7;
                for (let i = 0; i < points; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (points - i - 1));
                    data.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        messages: Math.floor(Math.random() * 100) + 50,
                        active: Math.floor(Math.random() * 20) + 25
                    });
                }
                break;
            case 'month':
                points = 30;
                for (let i = 0; i < points; i += 3) {
                    const date = new Date();
                    date.setDate(date.getDate() - (points - i - 1));
                    data.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        messages: Math.floor(Math.random() * 100) + 50,
                        active: Math.floor(Math.random() * 20) + 25
                    });
                }
                break;
            case 'year':
                points = 12;
                for (let i = 0; i < points; i++) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (points - i - 1));
                    data.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        messages: Math.floor(Math.random() * 150) + 100,
                        active: Math.floor(Math.random() * 30) + 15
                    });
                }
                break;
        }

        return data;
    };

    useEffect(() => {
        setIsLoading(true);

        // Simulate data loading with delay
        setTimeout(() => {
            setGroupMembers(generateMembersData());
            setActivityData(generateActivityData(timeframe));
            setIsLoading(false);
        }, 1000);
    }, [timeframe]);

    const handleTimeframeChange = (period: string) => {
        setTimeframe(period);
    };

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    // Members table columns definition
    const memberColumns = [
        {
            id: 'name',
            header: 'Member',
            accessor: (row: any) => row.name,
            sortable: true,
            cell: (value: string, row: any) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                        {value.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{value}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'role',
            header: 'Role',
            accessor: (row: any) => row.role,
            sortable: true,
            width: '120px',
            cell: (value: string) => {
                let color = '';
                let bgColor = '';

                switch (value) {
                    case 'Admin':
                        color = 'text-purple-700';
                        bgColor = 'bg-purple-50';
                        break;
                    case 'Moderator':
                        color = 'text-blue-700';
                        bgColor = 'bg-blue-50';
                        break;
                    default:
                        color = 'text-gray-700';
                        bgColor = 'bg-gray-50';
                }

                return (
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${bgColor} ${color}`}>
                        {value}
                    </span>
                );
            }
        },
        {
            id: 'department',
            header: 'Department',
            accessor: (row: any) => row.department,
            sortable: true,
            width: '120px'
        },
        {
            id: 'postsCount',
            header: 'Posts',
            accessor: (row: any) => row.postsCount,
            sortable: true,
            width: '80px',
            cell: (value: number) => (
                <div className="flex items-center">
                    <MessageCircle size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            id: 'lastActive',
            header: 'Last Active',
            accessor: (row: any) => row.lastActive,
            sortable: true,
            width: '120px',
            cell: (value: string) => (
                <div className="flex items-center">
                    <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (row: any) => row.status,
            sortable: true,
            width: '100px',
            cell: (value: string) => (
                <StatusBadge status={value as any} size="sm" withIcon withDot={value === 'active'} />
            )
        },
        {
            id: 'actions',
            header: '',
            accessor: (row: any) => row.id,
            sortable: false,
            width: '100px',
            cell: (value: string, row: any) => (
                <div className="flex items-center space-x-1">
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Send message"
                    >
                        <Mail size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className={`p-1.5 rounded-lg ${row.role === 'Admin' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'}`}
                        whileHover={row.role !== 'Admin' ? { scale: 1.1 } : undefined}
                        whileTap={row.role !== 'Admin' ? { scale: 0.95 } : undefined}
                        aria-label="Remove from group"
                        disabled={row.role === 'Admin'}
                    >
                        <UserMinus size={16} strokeWidth={1.8} />
                    </motion.button>
                </div>
            )
        }
    ];

    // Filter options for members
    const memberFilterOptions = [
        {
            id: 'role',
            label: 'Role',
            type: 'multiselect' as const,
            options: [
                { value: 'Admin', label: 'Admin' },
                { value: 'Moderator', label: 'Moderator' },
                { value: 'Member', label: 'Member' }
            ]
        },
        {
            id: 'department',
            label: 'Department',
            type: 'multiselect' as const,
            options: [
                { value: 'Backend', label: 'Backend' },
                { value: 'Frontend', label: 'Frontend' },
                { value: 'DevOps', label: 'DevOps' },
                { value: 'QA', label: 'QA' }
            ]
        },
        {
            id: 'status',
            label: 'Status',
            type: 'multiselect' as const,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ]
        },
        {
            id: 'minPosts',
            label: 'Minimum Posts',
            type: 'number' as const
        }
    ];

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Filter members logic would go here
    };

    // Handle filter apply
    const handleApplyFilters = (filters: Record<string, any>) => {
        // Filter members logic would go here
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white border border-gray-100 rounded-xl p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center">
                    <motion.button
                        className="mr-3 p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100"
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ArrowLeft size={20} strokeWidth={1.8} />
                    </motion.button>

                    <div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                                <UsersRound size={20} strokeWidth={1.8} />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-800">{group.name}</h1>
                            <StatusBadge
                                status={group.status as any}
                                size="sm"
                                withIcon
                                withDot={group.status === 'active'}
                                className="ml-3"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Share2 size={16} className="mr-2" strokeWidth={1.8} />
                        Share
                    </motion.button>
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Settings size={16} className="mr-2" strokeWidth={1.8} />
                        Settings
                    </motion.button>
                    <motion.button
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
                        whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                        whileTap={{ y: 0 }}
                    >
                        <MessageSquare size={16} className="mr-2" strokeWidth={1.8} />
                        Message
                    </motion.button>
                </div>
            </motion.div>

            {/* Key Metrics Cards */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                {/* Members Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-50 rounded-xl p-2">
                            <Users size={20} className="text-indigo-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className="px-2 py-1 bg-green-50 rounded-full text-xs text-green-600 font-medium">
                                {Math.round((group.activeMembers / group.memberCount) * 100)}% active
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {group.memberCount}
                    </h3>
                    <p className="text-sm text-gray-500">Total Members</p>
                </motion.div>

                {/* Messages Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 rounded-xl p-2">
                            <MessageCircle size={20} className="text-blue-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className={`flex items-center text-blue-600 text-xs font-medium`}>
                                <ArrowUpRight size={12} className="mr-0.5" strokeWidth={1.8} />
                                <span>14% more</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {group.postsCount}
                    </h3>
                    <p className="text-sm text-gray-500">Total Messages</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-50 rounded-xl p-2">
                            <TrendingUp size={20} className="text-green-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className={`flex items-center text-green-600 text-xs font-medium`}>
                                <ArrowUpRight size={12} className="mr-0.5" strokeWidth={1.8} />
                                <span>Very High</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {group.engagementRate}%
                    </h3>
                    <p className="text-sm text-gray-500">Engagement Rate</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-amber-50 rounded-xl p-2">
                            <FileText size={20} className="text-amber-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="px-2 py-1 bg-blue-50 rounded-full text-xs text-blue-600 font-medium">
                                {group.documentCount} docs
                            </div>
                            <div className="px-2 py-1 bg-indigo-50 rounded-full text-xs text-indigo-600 font-medium">
                                {group.taskCount} tasks
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {group.documentCount + group.taskCount}
                    </h3>
                    <p className="text-sm text-gray-500">Total Files</p>
                </motion.div>
            </motion.div>

            <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <LineChartIcon size={18} className="text-indigo-500 mr-2" strokeWidth={1.8} />
                        <h3 className="font-medium text-gray-800">Group Activity</h3>
                    </div>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            className={`px-3 py-1 text-xs rounded-lg transition-all ${timeframe === 'week' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
                            onClick={() => handleTimeframeChange('week')}
                        >
                            Week
                        </button>
                        <button
                            className={`px-3 py-1 text-xs rounded-lg transition-all ${timeframe === 'month' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
                            onClick={() => handleTimeframeChange('month')}
                        >
                            Month
                        </button>
                        <button
                            className={`px-3 py-1 text-xs rounded-lg transition-all ${timeframe === 'year' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
                            onClick={() => handleTimeframeChange('year')}
                        >
                            Year
                        </button>
                    </div>
                </div>

                <div className="h-64">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={activityData}
                                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                                                    <p className="text-gray-600 text-xs mb-1">{label}</p>
                                                    <p className="text-sm font-medium text-indigo-600 mb-1">
                                                        Messages: {payload[0]?.value}
                                                    </p>
                                                    <p className="text-sm font-medium text-green-500">
                                                        Active Members: {payload[1]?.value}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="messages"
                                    stroke="#6366F1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorMessages)"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: 'white', fill: '#6366F1' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="active"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorActive)"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: 'white', fill: '#10B981' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                >
                    <div className="flex items-center mb-5">
                        <Link2 size={18} className="text-indigo-500 mr-2" strokeWidth={1.8} />
                        <h3 className="font-medium text-gray-800">Group Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Created</span>
                            <span className="text-sm font-medium text-gray-700">{group.createdAt}</span>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Group Type</span>
                            <div className="flex items-center text-sm font-medium text-gray-700">
                                {group.type === 'private' ? (
                                    <Lock size={14} className="text-purple-500 mr-1.5" strokeWidth={1.8} />
                                ) : (
                                    <Globe size={14} className="text-blue-500 mr-1.5" strokeWidth={1.8} />
                                )}
                                <span className="capitalize">{group.type}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Admin</span>
                            <span className="text-sm font-medium text-indigo-600">{group.admin}</span>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Access Level</span>
                            <span className="text-sm font-medium text-gray-700 capitalize">{group.accessLevel}</span>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Last Activity</span>
                            <span className="text-sm font-medium text-gray-700">{group.lastActive}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Upcoming Meetings</span>
                            <span className="text-sm font-medium text-gray-700">{group.upcomingMeetings}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {group.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                >
                    <div className="flex items-center mb-5">
                        <UserCheck size={18} className="text-green-500 mr-2" strokeWidth={1.8} />
                        <h3 className="font-medium text-gray-800">Member Activity Stats</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-gray-50/80 rounded-xl p-3 text-center">
                            <h4 className="text-gray-500 text-xs mb-1">Active Today</h4>
                            <p className="text-xl font-semibold text-indigo-600">{group.memberStats.activeToday}</p>
                            <p className="text-xs text-gray-500">{Math.round((group.memberStats.activeToday / group.memberCount) * 100)}% of members</p>
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-3 text-center">
                            <h4 className="text-gray-500 text-xs mb-1">Active This Week</h4>
                            <p className="text-xl font-semibold text-indigo-600">{group.memberStats.activeThisWeek}</p>
                            <p className="text-xs text-gray-500">{Math.round((group.memberStats.activeThisWeek / group.memberCount) * 100)}% of members</p>
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-3 text-center">
                            <h4 className="text-gray-500 text-xs mb-1">Member Roles</h4>
                            <div className="flex justify-center gap-2 mt-1">
                                <div className="px-2 py-1 bg-purple-50 rounded-lg text-xs text-purple-600">
                                    {group.memberStats.roles.admin} admin
                                </div>
                                <div className="px-2 py-1 bg-blue-50 rounded-lg text-xs text-blue-600">
                                    {group.memberStats.roles.moderator} mods
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-3 text-center">
                            <h4 className="text-gray-500 text-xs mb-1">New This Month</h4>
                            <p className="text-xl font-semibold text-green-600">{group.memberStats.newThisMonth}</p>
                            <p className="text-xs text-gray-500">{Math.round((group.memberStats.newThisMonth / group.memberCount) * 100)}% growth</p>
                        </div>
                    </div>

                    <h4 className="font-medium text-gray-700 mb-3">Department Distribution</h4>
                    <div className="space-y-3">
                        {group.memberStats.byDepartment.map((dept, index) => (
                            <div key={dept.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-700">{dept.name}</span>
                                    <span className="text-xs font-medium">{dept.count} members</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(dept.count / group.memberCount) * 100}%`,
                                            background: index === 0
                                                ? 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                                                : index === 1
                                                    ? 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)'
                                                    : index === 2
                                                        ? 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)'
                                                        : 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                >
                    <div className="flex items-center mb-5">
                        <Layers size={18} className="text-indigo-500 mr-2" strokeWidth={1.8} />
                        <h3 className="font-medium text-gray-800">Channels & Metrics</h3>
                    </div>

                    <h4 className="font-medium text-gray-700 mb-3">Active Channels</h4>
                    <div className="space-y-3 mb-6">
                        {group.channels.map((channel, index) => (
                            <div key={channel.name} className="bg-gray-50/80 rounded-xl p-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700">#{channel.name}</span>
                                        {index === 0 && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-green-100 rounded text-xs text-green-700">
                                                Most active
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">{channel.lastActive}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <MessageCircle size={12} className="mr-1" strokeWidth={1.8} />
                                    <span>{channel.messageCount} messages</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h4 className="font-medium text-gray-700 mb-3">Device Usage</h4>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <Smartphone size={16} className="text-blue-500 mx-auto mb-1" strokeWidth={1.8} />
                            <p className="text-lg font-semibold text-blue-600">{group.activityMetrics.deviceUsage.mobile}%</p>
                            <p className="text-xs text-blue-500">Mobile</p>
                        </div>

                        <div className="bg-indigo-50 rounded-xl p-3 text-center">
                            <Laptop size={16} className="text-indigo-500 mx-auto mb-1" strokeWidth={1.8} />
                            <p className="text-lg font-semibold text-indigo-600">{group.activityMetrics.deviceUsage.desktop}%</p>
                            <p className="text-xs text-indigo-500">Desktop</p>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                            <Tablet size={16} className="text-purple-500 mx-auto mb-1" strokeWidth={1.8} />
                            <p className="text-lg font-semibold text-purple-600">{group.activityMetrics.deviceUsage.tablet}%</p>
                            <p className="text-xs text-purple-500">Tablet</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
            >
                <div className="border-b border-gray-100">
                    <div className="flex overflow-x-auto hide-scrollbar">
                        <button
                            className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${selectedTab === 'members'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => handleTabChange('members')}
                        >
                            Members
                        </button>
                        <button
                            className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${selectedTab === 'files'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => handleTabChange('files')}
                        >
                            Files & Documents
                        </button>
                        <button
                            className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${selectedTab === 'tasks'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => handleTabChange('tasks')}
                        >
                            Tasks
                        </button>
                        <button
                            className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${selectedTab === 'meetings'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => handleTabChange('meetings')}
                        >
                            Meetings
                        </button>
                        <button
                            className={`px-5 py-4 font-medium text-sm whitespace-nowrap ${selectedTab === 'analytics'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => handleTabChange('analytics')}
                        >
                            Analytics
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedTab === 'members' && (
                        <motion.div
                            key="members"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <Users size={18} className="text-indigo-500 mr-2" strokeWidth={1.8} />
                                    <h3 className="font-medium text-gray-800">Group Members</h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <SearchBox
                                        placeholder="Search members..."
                                        onSearch={handleSearch}
                                        minLength={1}
                                        className="w-full sm:w-60"
                                    />

                                    <FilterPanel
                                        title="Member Filters"
                                        filters={memberFilterOptions}
                                        onApplyFilters={handleApplyFilters}
                                        className="w-auto"
                                    />

                                    <motion.button
                                        className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm flex items-center"
                                        whileHover={{ scale: 1.02, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <UserPlus size={16} className="mr-2" strokeWidth={1.8} />
                                        Add Members
                                    </motion.button>
                                </div>
                            </div>

                            <div className="overflow-hidden">
                                <DataTable
                                    columns={memberColumns}
                                    data={groupMembers}
                                    selectable={true}
                                    isLoading={isLoading}
                                    emptyMessage="No members found for this group."
                                    defaultRowsPerPage={itemsPerPage}
                                />
                            </div>

                            <div className="p-4 border-t border-gray-100">
                                <Pagination
                                    totalItems={groupMembers.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    showItemsPerPage={true}
                                    itemsPerPageOptions={[5, 10, 25, 50]}
                                    showSummary={true}
                                />
                            </div>
                        </motion.div>
                    )}

                    {selectedTab !== 'members' && (
                        <motion.div
                            key="other-tab"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-16 text-center text-gray-500"
                        >
                            <div className="w-16 h-16 bg-indigo-50 rounded-full mx-auto flex items-center justify-center mb-4">
                                {selectedTab === 'files' && <FileText size={24} className="text-indigo-500" strokeWidth={1.8} />}
                                {selectedTab === 'tasks' && <Layers size={24} className="text-indigo-500" strokeWidth={1.8} />}
                                {selectedTab === 'meetings' && <Calendar size={24} className="text-indigo-500" strokeWidth={1.8} />}
                                {selectedTab === 'analytics' && <BarChart3 size={24} className="text-indigo-500" strokeWidth={1.8} />}
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                {selectedTab === 'files' && 'Files & Documents'}
                                {selectedTab === 'tasks' && 'Tasks Management'}
                                {selectedTab === 'meetings' && 'Group Meetings'}
                                {selectedTab === 'analytics' && 'Detailed Analytics'}
                            </h3>
                            <p className="mb-5">This section would display the {selectedTab} for this group.</p>
                            <motion.button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm inline-flex items-center"
                                whileHover={{ scale: 1.05, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus size={16} className="mr-2" strokeWidth={1.8} />
                                {selectedTab === 'files' && 'Upload Files'}
                                {selectedTab === 'tasks' && 'Create Task'}
                                {selectedTab === 'meetings' && 'Schedule Meeting'}
                                {selectedTab === 'analytics' && 'Generate Report'}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default GroupDetailPage;