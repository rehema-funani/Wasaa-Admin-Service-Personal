import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Shield, UserX, Award, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock creator data
const mockCreators = Array(10).fill(null).map((_, i) => ({
    id: `creator-${i + 1}`,
    name: `Creator ${i + 1}`,
    username: `creator${i + 1}`,
    avatar: `https://i.pravatar.cc/150?u=${i + 100}`,
    followers: Math.floor(Math.random() * 100000),
    contentCount: Math.floor(Math.random() * 100),
    status: ['active', 'warning', 'suspended'][Math.floor(Math.random() * 3)],
    violationCount: Math.floor(Math.random() * 6),
    joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

const CreatorsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [creators, setCreators] = useState(mockCreators);

    // Filter creators based on search and filter
    useEffect(() => {
        let filtered = mockCreators;

        if (search) {
            filtered = filtered.filter(creator =>
                creator.name.toLowerCase().includes(search.toLowerCase()) ||
                creator.username.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter !== 'all') {
            filtered = filtered.filter(creator => creator.status === filter);
        }

        setCreators(filtered);
    }, [search, filter]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Creator Profiles</h1>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search creators..."
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
                        <option value="all">All Creators</option>
                        <option value="active">Active</option>
                        <option value="warning">Warning</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Creator
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Violations
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {creators.map((creator) => (
                                <tr key={creator.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={creator.avatar} alt={creator.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{creator.name}</div>
                                                <div className="text-sm text-gray-500">@{creator.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{creator.contentCount} videos</div>
                                        <div className="text-sm text-gray-500">{creator.followers.toLocaleString()} followers</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${creator.status === 'active' ? 'bg-green-100 text-green-800' :
                                                creator.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {creator.violationCount > 0 ?
                                            <span className="text-red-600">{creator.violationCount} violations</span> :
                                            <span>No violations</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/admin/media/shorts/creators/${creator.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CreatorsPage;