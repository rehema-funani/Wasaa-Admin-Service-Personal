import React from 'react';
import { Clock, Flag, Eye } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    creator: string;
    creatorId: string;
    uploadDate: string;
    duration: number;
    views: number;
    flags: number;
    reason?: string;
    thumbnail: string;
    url: string;
}

interface VideoCardProps {
    video: Video;
    isSelected: boolean;
    onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isSelected, onClick }) => {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format duration (seconds to MM:SS)
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className={`rounded-lg overflow-hidden border ${isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-gray-200'
                } shadow-sm cursor-pointer transition-all hover:shadow-md`}
            onClick={onClick}
        >
            <div className="relative">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-[180px] object-cover"
                />

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                </div>

                {video.reason && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {video.reason}
                    </div>
                )}
            </div>

            <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{video.title}</h3>
                <p className="text-gray-500 text-xs mt-1">By {video.creator}</p>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                    <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>{formatDate(video.uploadDate)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{video.views.toLocaleString()}</span>
                        </div>

                        {video.flags > 0 && (
                            <div className="flex items-center text-red-600">
                                <Flag size={12} className="mr-1" />
                                <span>{video.flags}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};