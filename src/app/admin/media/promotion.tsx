import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Search, Filter, Video, Star, ArrowUpRight,
    Award, MapPin,
    TrendingUp
} from 'lucide-react';

// Mock video data for promotion
const mockVideos = Array(12).fill(null).map((_, i) => ({
    id: `vid-${i}`,
    title: `Short video #${i + 1}`,
    creator: {
        id: `creator-${i + 1}`,
        name: `Creator ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?u=${i + 100}`
    },
    uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    views: Math.floor(Math.random() * 1000000),
    likes: Math.floor(Math.random() * 50000),
    comments: Math.floor(Math.random() * 1000),
    thumbnail: `https://picsum.photos/id/${i + 50}/400/720`,
    promoted: Math.random() > 0.7,
    promotionType: ['trending', 'featured', 'editor-pick'][Math.floor(Math.random() * 3)],
    category: ['Entertainment', 'Comedy', 'Education', 'Music', 'Fashion'][Math.floor(Math.random() * 5)],
    region: ['Global', 'Africa', 'Kenya', 'Nigeria', 'Ghana'][Math.floor(Math.random() * 5)]
}));

const PromotionPage: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'trending' | 'featured' | 'editor-pick'>('trending');
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('all');
    const [category, setCategory] = useState('all');
    const [videos, setVideos] = useState(mockVideos);

    // Set active tab based on URL
    useEffect(() => {
        if (location.pathname.includes('/trending')) {
            setActiveTab('trending');
        } else if (location.pathname.includes('/featured')) {
            setActiveTab('featured');
        } else if (location.pathname.includes('/editor-pick')) {
            setActiveTab('editor-pick');
        }
    }, [location]);

    // Filter videos
    useEffect(() => {
        let filtered = mockVideos;

        // Filter by search
        if (search) {
            filtered = filtered.filter(video =>
                video.title.toLowerCase().includes(search.toLowerCase()) ||
                video.creator.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by region
        if (region !== 'all') {
            filtered = filtered.filter(video => video.region === region);
        }

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(video => video.category === category);
        }

        // Filter by promotion type
        filtered = filtered.filter(video => {
            if (!activeTab) return true;
            if (activeTab === 'trending') return video.promotionType === 'trending';
            if (activeTab === 'featured') return video.promotionType === 'featured';
            if (activeTab === 'editor-pick') return video.promotionType === 'editor-pick';
            return true;
        });

        setVideos(filtered);
    }, [search, region, category, activeTab]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-medium">Content Promotion</h1>
                    <p className="text-gray-500 text-sm mt-1">Promote and feature high-quality shorts</p>
                </div>

                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center">
                    <Star size={16} className="mr-2" />
                    Add New Promotion
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('trending')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'trending'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TrendingUp size={16} className="mr-2" />
                            Trending
                        </button>

                        <button
                            onClick={() => setActiveTab('featured')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'featured'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Star size={16} className="mr-2" />
                            Featured
                        </button>

                        <button
                            onClick={() => setActiveTab('editor-pick')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'editor-pick'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Award size={16} className="mr-2" />
                            Editor's Picks
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
                            placeholder="Search videos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>

                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                        <option value="all">All Regions</option>
                        <option value="Global">Global</option>
                        <option value="Africa">Africa</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                    </select>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                        <option value="all">All Categories</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Education">Education</option>
                        <option value="Music">Music</option>
                        <option value="Fashion">Fashion</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.length > 0 ? (
                    videos.map(video => (
                        <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />

                                {video.promoted && (
                                    <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                                        {video.promotionType === 'trending' ? 'Trending' :
                                            video.promotionType === 'featured' ? 'Featured' : 'Editor\'s Pick'}
                                    </div>
                                )}
                            </div>

                            <div className="p-3">
                                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{video.title}</h3>

                                <div className="flex items-center mt-2">
                                    <img
                                        src={video.creator.avatar}
                                        alt={video.creator.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="ml-2 text-xs text-gray-600">{video.creator.name}</span>
                                </div>

                                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <MapPin size={12} className="mr-1" />
                                        <span>{video.region}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <ArrowUpRight size={12} className="mr-1" />
                                        <span>{(video.views / 1000).toFixed(1)}k views</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-between">
                                    {video.promoted ? (
                                        <button className="w-full px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                                            Remove Promotion
                                        </button>
                                    ) : (
                                        <button className="w-full px-3 py-1.5 text-xs bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100">
                                            Promote Video
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <Video size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No videos found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionPage;