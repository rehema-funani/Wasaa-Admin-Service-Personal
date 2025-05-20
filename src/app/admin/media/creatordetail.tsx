import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, User, Shield, UserX, Video, Flag,
    MessageSquare, ThumbsUp, Share, Bell, Calendar
} from 'lucide-react';

// Mock creator detailed data
const getCreatorData = (id: string) => ({
    id,
    name: `Creator ${id.split('-')[1]}`,
    username: `creator${id.split('-')[1]}`,
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    email: `creator${id.split('-')[1]}@example.com`,
    phone: `+1234567${id.split('-')[1]}`,
    bio: 'Content creator passionate about lifestyle and travel videos',
    followers: Math.floor(Math.random() * 100000),
    following: Math.floor(Math.random() * 1000),
    contentCount: Math.floor(Math.random() * 100),
    status: ['active', 'warning', 'suspended'][Math.floor(Math.random() * 3)],
    joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    lastActive: new Date(Date.now() - Math.random() * 1000000).toISOString(),
    violationHistory: Array(Math.floor(Math.random() * 5)).fill(null).map((_, i) => ({
        id: `violation-${i}`,
        type: ['Hate Speech', 'NSFW Content', 'Copyright', 'Misinformation', 'Spam'][Math.floor(Math.random() * 5)],
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: ['Warning', 'Strike', 'Resolved'][Math.floor(Math.random() * 3)],
        description: `Violation description ${i + 1}. This content was flagged for review.`
    })),
    recentVideos: Array(5).fill(null).map((_, i) => ({
        id: `video-${i}`,
        title: `Video ${i + 1} by Creator ${id.split('-')[1]}`,
        views: Math.floor(Math.random() * 50000),
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 1000),
        uploadDate: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
        thumbnail: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/720`
    }))
});

const CreatorDetail: React.FC = () => {
    const { creatorId } = useParams<{ creatorId: string }>();
    const [creator, setCreator] = useState<ReturnType<typeof getCreatorData> | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (creatorId) {
            // In a real app, fetch from API
            setCreator(getCreatorData(creatorId));
        }
    }, [creatorId]);

    if (!creator) {
        return <div className="p-6 text-center">Loading creator details...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to="/admin/media/shorts/creators" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Creators
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 flex items-start">
                    <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
                    />

                    <div className="ml-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-medium text-gray-900">{creator.name}</h1>
                            <span className={`ml-3 px-3 py-1 text-xs rounded-full font-semibold
                ${creator.status === 'active' ? 'bg-green-100 text-green-800' :
                                    creator.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`}>
                                {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                            </span>
                        </div>

                        <p className="text-gray-500 mt-1">@{creator.username}</p>

                        <div className="mt-4 flex items-center space-x-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-900">{creator.followers.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">Followers</span>
                            </div>

                            <div>
                                <span className="font-medium text-gray-900">{creator.contentCount}</span>
                                <span className="text-gray-500 ml-1">Videos</span>
                            </div>

                            <div>
                                <span className="font-medium text-gray-900">{creator.violationHistory.length}</span>
                                <span className="text-gray-500 ml-1">Violations</span>
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto space-x-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                            Send Notification
                        </button>

                        {creator.status !== 'suspended' ? (
                            <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium">
                                Suspend Account
                            </button>
                        ) : (
                            <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium">
                                Restore Account
                            </button>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 text-sm font-medium ${activeTab === 'overview'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Overview
                        </button>

                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-3 text-sm font-medium ${activeTab === 'videos'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Videos
                        </button>

                        <button
                            onClick={() => setActiveTab('violations')}
                            className={`px-6 py-3 text-sm font-medium ${activeTab === 'violations'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Violation History
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                        <div className="p-6">
                            <h2 className="text-lg font-medium mb-4">Creator Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                    <p className="text-sm font-medium">{creator.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                    <p className="text-sm font-medium">{creator.phone}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Join Date</p>
                                    <p className="text-sm font-medium">
                                        {new Date(creator.joinDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Last Active</p>
                                    <p className="text-sm font-medium">
                                        {new Date(creator.lastActive).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm text-gray-500 mb-1">Bio</p>
                                <p className="text-sm">{creator.bio}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-lg font-medium mb-4">Actions</h2>

                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                                    <span className="flex items-center">
                                        <Bell size={16} className="mr-2 text-indigo-600" />
                                        Send Warning
                                    </span>
                                    <ArrowLeft size={14} className="transform rotate-180" />
                                </button>

                                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                                    <span className="flex items-center">
                                        <Video size={16} className="mr-2 text-indigo-600" />
                                        Review Content
                                    </span>
                                    <ArrowLeft size={14} className="transform rotate-180" />
                                </button>

                                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                                    <span className="flex items-center">
                                        <Shield size={16} className="mr-2 text-indigo-600" />
                                        Add Strike
                                    </span>
                                    <ArrowLeft size={14} className="transform rotate-180" />
                                </button>

                                <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm">
                                    <span className="flex items-center">
                                        <Calendar size={16} className="mr-2 text-indigo-600" />
                                        Temporary Mute
                                    </span>
                                    <ArrowLeft size={14} className="transform rotate-180" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'videos' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-medium mb-4">Recent Videos</h2>

                        <div className="space-y-4">
                            {creator.recentVideos.map(video => (
                                <div key={video.id} className="flex items-start border-b border-gray-100 pb-4 last:border-0">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-24 h-36 object-cover rounded-md"
                                    />

                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-900">{video.title}</h3>

                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <ThumbsUp size={14} className="mr-1" />
                                                <span>{video.likes.toLocaleString()}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <MessageSquare size={14} className="mr-1" />
                                                <span>{video.comments.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-auto">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'violations' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-medium mb-4">Violation History</h2>

                        {creator.violationHistory.length > 0 ? (
                            <div className="space-y-4">
                                {creator.violationHistory.map(violation => (
                                    <div key={violation.id} className="border-b border-gray-100 pb-4 last:border-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{violation.type}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{violation.description}</p>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(violation.date).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <span className={`px-3 py-1 text-xs rounded-full font-semibold
                        ${violation.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                                    violation.status === 'Strike' ? 'bg-red-100 text-red-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {violation.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Shield size={32} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No violations on record.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatorDetail;