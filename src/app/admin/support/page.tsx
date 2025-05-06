import React, { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Clock,
    ChevronRight,
    AlertTriangle,
    BarChart4,
    ArrowUpRight,
    CheckCircle2,
    MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/common/Card';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

const mockTickets = [
    {
        id: '1',
        title: 'Payment gateway integration issue',
        status: 'open',
        priority: 'high',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        escalated: false
    },
    {
        id: '2',
        title: 'Account verification failed',
        status: 'in-progress',
        priority: 'medium',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        escalated: false
    },
    {
        id: '3',
        title: 'Withdrawal stuck in pending state',
        status: 'pending',
        priority: 'critical',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        escalated: true
    },
    {
        id: '4',
        title: 'Transaction history not updating',
        status: 'open',
        priority: 'medium',
        createdAt: new Date(Date.now() - 28800000).toISOString(),
        escalated: false
    }
];

const mockTeams = [
    {
        id: '1',
        name: 'Payment Support',
        members: [
            { id: '101', name: 'John Doe', avatar: '/api/placeholder/32/32' },
            { id: '102', name: 'Jane Smith', avatar: '/api/placeholder/32/32' },
            { id: '103', name: 'Mike Johnson', avatar: '/api/placeholder/32/32' }
        ]
    },
    {
        id: '2',
        name: 'Account Verification',
        members: [
            { id: '104', name: 'Sarah Williams', avatar: '/api/placeholder/32/32' },
            { id: '105', name: 'Robert Chen', avatar: '/api/placeholder/32/32' }
        ]
    }
];

const stats = [
    {
        title: 'Open Tickets',
        value: 24,
        trend: '+12%',
        trendUp: true,
        icon: <MessageSquare size={20} className="text-blue-600" />,
        color: 'blue'
    },
    {
        title: 'Resolution Time',
        value: '1.4d',
        trend: '-8%',
        trendUp: false,
        icon: <Clock size={20} className="text-purple-600" />,
        color: 'purple'
    },
    {
        title: 'Customer Satisfaction',
        value: '94%',
        trend: '+2%',
        trendUp: true,
        icon: <CheckCircle2 size={20} className="text-green-600" />,
        color: 'green'
    },
    {
        title: 'Escalations',
        value: 7,
        trend: '+3',
        trendUp: true,
        icon: <AlertTriangle size={20} className="text-red-600" />,
        color: 'red'
    }
];

const page:React.FC = () => {
    const [chartLoaded, setChartLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setChartLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Support Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of support activities and metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend}
                                </span>
                                <ArrowUpRight
                                    size={14}
                                    className={`ml-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600 transform rotate-90'}`}
                                />
                                <span className="text-xs text-gray-500 ml-1">vs. last week</span>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Ticket Trends</h2>
                                <div className="flex space-x-2">
                                    <Badge className="primary">This Month</Badge>
                                    <Badge className="default">Previous</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full">
                                {chartLoaded ? (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                                        <BarChart4 size={64} className="text-blue-200" />
                                        <span className="ml-4 text-gray-400">Chart visualization would be rendered here</span>
                                    </div>
                                ) : (
                                    <div className="w-full h-full animate-pulse bg-gray-100 rounded-lg"></div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Support Teams</h2>
                                <Badge>{mockTeams.length}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockTeams.map((team) => (
                                    <div key={team.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <Users size={16} className="text-blue-600" />
                                                </div>
                                                <h3 className="ml-2 font-medium text-gray-900">{team.name}</h3>
                                            </div>
                                            <Badge className="default" size="sm">{team.members.length}</Badge>
                                        </div>
                                        <div className="mt-2 flex -space-x-2">
                                            {team.members.slice(0, 3).map((member) => (
                                                <Avatar
                                                    key={member.id}
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    initials={member.name.charAt(0)}
                                                    size="sm"
                                                    className="border-2 border-white"
                                                />
                                            ))}
                                            {team.members.length > 3 && (
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs text-gray-600 font-medium">
                                                    +{team.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                rightIcon={<ChevronRight size={16} />}
                            >
                                View All Teams
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    rightIcon={<ChevronRight size={16} />}
                                >
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <th className="px-4 py-3">Ticket</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Priority</th>
                                            <th className="px-4 py-3">Created</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {mockTickets.map((ticket) => (
                                            <motion.tr
                                                key={ticket.id}
                                                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                                                className="text-sm text-gray-900"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        {ticket.escalated ? (
                                                            <AlertTriangle size={16} className="text-red-500 mr-2" />
                                                        ) : (
                                                            <FileText size={16} className="text-gray-400 mr-2" />
                                                        )}
                                                        <span className="font-medium truncate max-w-xs">{ticket.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            ticket.status === 'open' ? 'bg-gray-200 text-gray-800' :
                                                                ticket.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                                                                    ticket.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                                                        'bg-green-200 text-green-800'
                                                        }
                                                        size="sm"
                                                    >
                                                        {ticket.status.replace('-', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            ticket.priority === 'low' ? 'bg-gray-200 text-gray-800' :
                                                                ticket.priority === 'medium' ? 'bg-blue-200 text-blue-800' :
                                                                    ticket.priority === 'high' ? 'bg-yellow-200 text-yellow-800' :
                                                                        'bg-red-200 text-red-800'
                                                        }
                                                        size="sm"
                                                    >
                                                        {ticket.priority}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(ticket.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default page;