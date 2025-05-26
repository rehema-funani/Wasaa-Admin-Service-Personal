import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { CommentList } from '../../../components/media/CommentList';

const CommentsPage: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Mock videos for the dropdown
    const videos = Array(5).fill(null).map((_, i) => ({
        id: `vid-${i}`,
        title: `Video #${i + 1}`,
    }));

    const [selectedVideo, setSelectedVideo] = useState(videos[0].id);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Comments Moderation</h1>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search comments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>

                    <select
                        value={selectedVideo}
                        onChange={(e) => setSelectedVideo(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                        {videos.map(video => (
                            <option key={video.id} value={video.id}>{video.title}</option>
                        ))}
                    </select>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                        <option value="all">All Comments</option>
                        <option value="flagged">Flagged</option>
                        <option value="reported">Reported</option>
                    </select>

                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
                <CommentList videoId={selectedVideo} filter={filter} search={search} />
            </div>
        </div>
    );
};

export default CommentsPage;