import React, { useState } from 'react';
import { Hash, Search, PlusCircle } from 'lucide-react';
import { TagManager } from '../../../components/media/TagManager';

const HashtagsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [newTag, setNewTag] = useState('');

    const tags: any = [
        { id: 1, name: 'dance', count: 45621, status: 'active' },
        { id: 2, name: 'funny', count: 38947, status: 'active' },
        { id: 3, name: 'food', count: 28503, status: 'active' },
        { id: 4, name: 'prank', count: 18654, status: 'warning' },
        { id: 5, name: 'challenge', count: 15431, status: 'active' },
        { id: 6, name: 'gaming', count: 12567, status: 'active' },
        { id: 7, name: 'nsfw', count: 5342, status: 'blocked' },
        { id: 8, name: 'sports', count: 9876, status: 'active' },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Tags & Hashtags</h1>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <div className="relative flex">
                        <input
                            type="text"
                            placeholder="Add new tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <button className="p-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
                            <PlusCircle size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <TagManager tags={tags} search={search} />
        </div>
    );
};

export default HashtagsPage;