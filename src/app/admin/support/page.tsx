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
        icon: <MessageSquare size={18} className="text-blue-600" />,
        color: 'blue'
    },
    {
        title: 'Resolution Time',
        value: '1.4d',
        trend: '-8%',
        trendUp: false,
        icon: <Clock size={18} className="text-purple-600" />,
        color: 'purple'
    },
    {
        title: 'Customer Satisfaction',
        value: '94%',
        trend: '+2%',
        trendUp: true,
        icon: <CheckCircle2 size={18} className="text-green-600" />,
        color: 'green'
    },
    {
        title: 'Escalations',
        value: 7,
        trend: '+3',
        trendUp: true,
        icon: <AlertTriangle size={18} className="text-red-600" />,
        color: 'red'
    }
];

const page: React.FC = () => {
    const [chartLoaded, setChartLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setChartLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="p-5">
                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-gray-900">Support Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Overview of support activities and metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm hover:shadow transition-all duration-200">
                            <div className="flex items-start justify-between p-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
                                    <h3 className="text-xl font-semibold text-gray-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-2 rounded-lg bg-${stat.color}-50/80 backdrop-blur-sm ring-1 ring-${stat.color}-100/50`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="px-4 pb-4 flex items-center">
                                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend}
                                </span>
                                <ArrowUpRight
                                    size={12}
                                    className={`ml-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600 transform rotate-90'}`}
                                />
                                <span className="text-xs text-gray-500 ml-1">vs. last week</span>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-medium text-gray-900">Ticket Trends</h2>
                                <div className="flex space-x-2">
                                    <Badge className="bg-blue-50 text-blue-700 border border-blue-100/70">This Month</Badge>
                                    <Badge className="bg-gray-50 text-gray-700 border border-gray-100/70">Previous</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-60 w-full">
                                {chartLoaded ? (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-50/70 to-blue-50/30 rounded-lg flex items-center justify-center border border-blue-100/20">
                                        <BarChart4 size={48} className="text-blue-200" />
                                        <span className="ml-4 text-gray-400 text-sm">Chart visualization would be rendered here</span>
                                    </div>
                                ) : (
                                    <div className="w-full h-full animate-pulse bg-gray-100/70 rounded-lg"></div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-medium text-gray-900">Support Teams</h2>
                                <Badge className="bg-gray-50 text-gray-700 border border-gray-100/70">{mockTeams.length}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockTeams.map((team) => (
                                    <div key={team.id} className="p-3 border border-gray-100/70 rounded-lg hover:bg-blue-50/30 transition-all duration-200 hover:border-blue-100/50 group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="bg-blue-50/80 p-1.5 rounded-lg ring-1 ring-blue-100/50">
                                                    <Users size={14} className="text-blue-600" />
                                                </div>
                                                <h3 className="ml-2 font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors duration-200">{team.name}</h3>
                                            </div>
                                            <Badge className="bg-gray-50 text-gray-600 border border-gray-100/70 text-xs" size="sm">{team.members.length}</Badge>
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
                                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 border-2 border-white text-xs text-gray-600 font-medium">
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
                                className="w-full text-xs text-blue-600 border-blue-100 hover:bg-blue-50 transition-colors duration-200"
                                rightIcon={<ChevronRight size={14} />}
                            >
                                View All Teams
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-5">
                    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/70 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-medium text-gray-900">Recent Tickets</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:bg-blue-50 transition-colors duration-200 text-xs"
                                    rightIcon={<ChevronRight size={14} />}
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
                                            <th className="px-3 py-2.5">Ticket</th>
                                            <th className="px-3 py-2.5">Status</th>
                                            <th className="px-3 py-2.5">Priority</th>
                                            <th className="px-3 py-2.5">Created</th>
                                            <th className="px-3 py-2.5">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100/70">
                                        {mockTickets.map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                className="text-sm text-gray-900 hover:bg-blue-50/30 transition-colors duration-200"
                                            >
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center">
                                                        {ticket.escalated ? (
                                                            <AlertTriangle size={14} className="text-red-500 mr-2" />
                                                        ) : (
                                                            <FileText size={14} className="text-gray-400 mr-2" />
                                                        )}
                                                        <span className="font-medium truncate max-w-xs text-xs">{ticket.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <Badge
                                                        className={`text-xs ${ticket.status === 'open' ? 'bg-gray-50 text-gray-700 border border-gray-200/70' :
                                                                ticket.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border border-blue-200/70' :
                                                                    ticket.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200/70' :
                                                                        'bg-green-50 text-green-700 border border-green-200/70'
                                                            }`}
                                                        size="sm"
                                                    >
                                                        {ticket.status.replace('-', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <Badge
                                                        className={`text-xs ${ticket.priority === 'low' ? 'bg-gray-50 text-gray-700 border border-gray-200/70' :
                                                                ticket.priority === 'medium' ? 'bg-blue-50 text-blue-700 border border-blue-200/70' :
                                                                    ticket.priority === 'high' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200/70' :
                                                                        'bg-red-50 text-red-700 border border-red-200/70'
                                                            }`}
                                                        size="sm"
                                                    >
                                                        {ticket.priority}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-2.5 text-gray-500 text-xs">
                                                    {new Date(ticket.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:bg-blue-50 text-xs transition-colors duration-200"
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style>{`
                /* iOS 18-like glass morphism */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
            `}</style>
        </>
    );
};

export default page;