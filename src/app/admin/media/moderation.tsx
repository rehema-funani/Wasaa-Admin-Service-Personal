import React, { useState } from 'react';
import { Search, Filter, Video } from 'lucide-react';
import { VideoCard } from '../../../components/media/VideoCard';
import { VideoPlayer } from '../../../components/media/VideoPlayer';
import { ModerateActionBar } from '../../../components/media/ModerateActionBar';

const mockVideos = Array(12).fill(null).map((_, i) => ({
    id: `vid-${i}`,
    title: `Short video #${i + 1}`,
    creator: `Creator ${i + 1}`,
    creatorId: `user-${i + 1}`,
    uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    duration: Math.floor(Math.random() * 45) + 15, 
    views: Math.floor(Math.random() * 100000),
    flags: Math.floor(Math.random() * 5),
    reason: ['NSFW', 'Hate Speech', 'Violence', 'Copyright', 'Spam'][Math.floor(Math.random() * 5)],
    thumbnail: `https://picsum.photos/id/${i + 10}/400/720`,
    url: 'https://example.com/video.mp4'
}));

const VideoModeration: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<typeof mockVideos[0] | null>(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Video Moderation Queue</h1>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                        <option value="all">All Videos</option>
                        <option value="flagged">Flagged</option>
                        <option value="pending">Pending Review</option>
                        <option value="ai-flagged">AI Flagged</option>
                    </select>

                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Video list */}
                <div className="w-1/3 pr-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {mockVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                isSelected={selectedVideo?.id === video.id}
                                onClick={() => setSelectedVideo(video)}
                            />
                        ))}
                    </div>
                </div>

                {/* Video preview & moderation */}
                <div className="w-2/3">
                    {selectedVideo ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <VideoPlayer video={selectedVideo} />
                            <ModerateActionBar video={selectedVideo} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[500px] flex items-center justify-center">
                            <div className="text-center p-6">
                                <Video size={48} className="mx-auto text-gray-300 mb-3" />
                                <h3 className="text-lg font-medium text-gray-700">No video selected</h3>
                                <p className="text-gray-500 mt-1">Select a video from the queue to review</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoModeration;