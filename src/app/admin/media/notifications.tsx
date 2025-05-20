import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Bell, Users, Filter, Search, Plus, Copy,
    Trash, Edit, Send, CheckCircle, Clock
} from 'lucide-react';

// Mock notification templates
const mockTemplates = [
    {
        id: 'template-1',
        name: 'Content Violation Warning',
        subject: 'Important: Action Required on Your Content',
        body: 'Dear {username}, your content "{content_title}" has been flagged for violating our community guidelines regarding {violation_type}. Please review our policies and take appropriate action within 48 hours.',
        type: 'warning',
        lastEdited: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
        id: 'template-2',
        name: 'Account Strike Notification',
        subject: 'Account Strike Added to Your Profile',
        body: 'Dear {username}, we have issued a strike to your account due to repeated violations of our community guidelines. This is strike {strike_number} out of 3. Please review the details and our policies.',
        type: 'strike',
        lastEdited: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
    },
    {
        id: 'template-3',
        name: 'Content Takedown Notice',
        subject: 'Your Content Has Been Removed',
        body: 'Dear {username}, your content "{content_title}" has been removed because it violates our policies on {violation_type}. Repeated violations may result in account suspension.',
        type: 'takedown',
        lastEdited: new Date(Date.now() - 3600000 * 24 * 14).toISOString()
    },
    {
        id: 'template-4',
        name: 'Account Suspension',
        subject: 'Your Account Has Been Temporarily Suspended',
        body: 'Dear {username}, due to repeated violations of our community guidelines, your account has been temporarily suspended for {suspension_period}. You can appeal this decision or contact support for more information.',
        type: 'suspension',
        lastEdited: new Date(Date.now() - 3600000 * 24 * 21).toISOString()
    },
    {
        id: 'template-5',
        name: 'Featured Content Announcement',
        subject: 'Congratulations! Your Content Has Been Featured',
        body: 'Dear {username}, congratulations! Your content "{content_title}" has been selected to be featured on our platform. This recognition is based on the quality and engagement of your content.',
        type: 'featured',
        lastEdited: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
    }
];

// Mock notification history
const mockHistory = Array(10).fill(null).map((_, i) => ({
    id: `notification-${i}`,
    template: mockTemplates[Math.floor(Math.random() * mockTemplates.length)].name,
    recipients: Math.floor(Math.random() * 1000) + 1,
    sender: ['System', 'Admin', 'Moderation Team'][Math.floor(Math.random() * 3)],
    status: ['sent', 'scheduled', 'draft'][Math.floor(Math.random() * 3)],
    sentDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    openRate: Math.floor(Math.random() * 100) + '%'
}));

const NotificationsPage: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    const [templates, setTemplates] = useState(mockTemplates);
    const [history, setHistory] = useState(mockHistory);
    const [selectedTemplate, setSelectedTemplate] = useState<typeof mockTemplates[0] | null>(null);

    // Set active tab based on URL
    useEffect(() => {
        if (location.pathname.includes('/templates')) {
            setActiveTab('templates');
        } else {
            setActiveTab('history');
        }
    }, [location]);

    // Filter templates based on search and type
    useEffect(() => {
        let filtered = mockTemplates;

        if (search) {
            filtered = filtered.filter(template =>
                template.name.toLowerCase().includes(search.toLowerCase()) ||
                template.subject.toLowerCase().includes(search.toLowerCase()) ||
                template.body.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (type !== 'all') {
            filtered = filtered.filter(template => template.type === type);
        }

        setTemplates(filtered);
    }, [search, type]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-medium">Notification Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Create and manage notification templates for users</p>
                </div>

                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center">
                    <Plus size={16} className="mr-2" />
                    New Template
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'templates'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Bell size={16} className="mr-2" />
                            Templates
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'history'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Clock size={16} className="mr-2" />
                            Notification History
                        </button>
                    </nav>
                </div>

                <div className="p-4 flex flex-wrap gap-3">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={activeTab === 'templates' ? "Search templates..." : "Search notification history..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    {activeTab === 'templates' && (
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="warning">Warning</option>
                            <option value="strike">Strike</option>
                            <option value="takedown">Takedown</option>
                            <option value="suspension">Suspension</option>
                            <option value="featured">Featured</option>
                        </select>
                    )}

                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {activeTab === 'templates' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Template Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subject
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Edited
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${template.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                    template.type === 'strike' ? 'bg-red-100 text-red-800' :
                                                        template.type === 'takedown' ? 'bg-orange-100 text-orange-800' :
                                                            template.type === 'suspension' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-green-100 text-green-800'}`}>
                                                {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{template.subject}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(template.lastEdited).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                                                    <Copy size={16} />
                                                </button>
                                                <button className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded">
                                                    <Send size={16} />
                                                </button>
                                                <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {templates.length === 0 && (
                        <div className="text-center py-10">
                            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No templates found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Template
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recipients
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sender
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Open Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mockHistory.map((notification) => (
                                    <tr key={notification.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{notification.template}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {notification.recipients.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {notification.sender}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                    notification.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(notification.sentDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                                            {notification.openRate}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {mockHistory.length === 0 && (
                        <div className="text-center py-10">
                            <Clock size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No notification history found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;