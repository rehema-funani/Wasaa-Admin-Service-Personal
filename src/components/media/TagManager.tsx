import React from 'react';
import { Trash, AlertTriangle, CheckCircle2, Edit, ArrowsUpFromLine } from 'lucide-react';

interface Tag {
    id: number;
    name: string;
    count: number;
    status: 'active' | 'warning' | 'blocked';
}

interface TagManagerProps {
    tags: Tag[];
    search: string;
}

export const TagManager: React.FC<TagManagerProps> = ({ tags, search }) => {
    // Filter tags based on search
    const filteredTags = search
        ? tags.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
        : tags;

    // Sort by usage count (most used first)
    const sortedTags = [...filteredTags].sort((a, b) => b.count - a.count);

    // Get tag status indicator
    const getTagStatus = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    icon: <CheckCircle2 size={14} className="text-green-600" />,
                    text: 'Active',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800'
                };
            case 'warning':
                return {
                    icon: <AlertTriangle size={14} className="text-amber-600" />,
                    text: 'Warning',
                    bgColor: 'bg-amber-100',
                    textColor: 'text-amber-800'
                };
            case 'blocked':
                return {
                    icon: <Trash size={14} className="text-red-600" />,
                    text: 'Blocked',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800'
                };
            default:
                return {
                    icon: null,
                    text: 'Unknown',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800'
                };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tag
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <span>Usage Count</span>
                                    <ArrowsUpFromLine size={14} className="ml-1" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedTags.map((tag) => {
                            const status = getTagStatus(tag.status);

                            return (
                                <tr key={tag.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-gray-100 rounded-lg p-1 mr-3">
                                                <span className="text-gray-600 font-mono text-lg">#</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{tag.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {tag.count.toLocaleString()} videos
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                                            {status.icon}
                                            <span className="ml-1">{status.text}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded">
                                                <Edit size={16} />
                                            </button>
                                            {tag.status !== 'blocked' ? (
                                                <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                                                    <Trash size={16} />
                                                </button>
                                            ) : (
                                                <button className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded">
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredTags.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No tags found. Try adjusting your search.</p>
                </div>
            )}
        </div>
    );
};