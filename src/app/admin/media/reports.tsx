import React, { useState } from 'react';
import { Flag, Search, Filter } from 'lucide-react';
import { ReportItem } from '../../../components/media/ReportItem';

const mockReports = Array(10).fill(null).map((_, i) => {
    const statuses: Array<"pending" | "reviewing" | "resolved"> = ["pending", "reviewing", "resolved"];
    return {
        id: `report-${i}`,
        reporter: {
            id: `user-${i + 100}`,
            name: `User ${i + 100}`,
            avatar: `https://i.pravatar.cc/150?u=${i + 100}`
        },
        video: {
            id: `vid-${i}`,
            title: `Reported video #${i + 1}`,
            thumbnail: `https://picsum.photos/id/${i + 30}/400/720`,
            creator: `Creator ${i + 1}`
        },
        reason: ['NSFW Content', 'Hate Speech', 'Violence', 'Copyright', 'Misinformation'][Math.floor(Math.random() * 5)],
        details: 'This content violates community guidelines by showing inappropriate content.',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        dateReported: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        reportCount: Math.floor(Math.random() * 10) + 1
    };
});

const ReportsPage: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">User Reports</h1>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search reports..."
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
                        <option value="all">All Reports</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Under Review</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {mockReports.map((report) => (
                        <ReportItem
                            key={report.id}
                            report={report}
                            isSelected={selectedReport === report.id}
                            onClick={() => setSelectedReport(report.id === selectedReport ? null : report.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;