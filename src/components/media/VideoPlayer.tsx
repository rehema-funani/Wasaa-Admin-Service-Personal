import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    creator: string;
    uploadDate: string;
    thumbnail: string;
    url: string;
}

interface VideoPlayerProps {
    video: Video;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    // These would be hooked up to actual video functionality in a real implementation
    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="w-full">
            <div className="relative bg-black aspect-[9/16] max-h-[600px]">
                {/* For demo, just display the thumbnail. In a real implementation, use an actual video player */}
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-contain"
                />

                {/* Controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={togglePlay}
                            className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleMute}
                                className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>

                            <button className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50">
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/30 rounded-full h-1">
                        <div
                            className="bg-indigo-600 h-1 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200">
                <h2 className="font-medium text-gray-900">{video.title}</h2>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span>By {video.creator}</span>
                    <span className="mx-2">•</span>
                    <span>
                        {new Date(video.uploadDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};