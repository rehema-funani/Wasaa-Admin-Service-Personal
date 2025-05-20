import React from 'react';
import { ChevronDown, ChevronUp, Clock, Flag, Video, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface Report {
    id: string;
    reporter: {
        id: string;
        name: string;
        avatar: string;
    };
    video: {
        id: string;
        title: string;
        thumbnail: string;
        creator: string;
    };
    reason: string;
    details: string;
    status: 'pending' | 'reviewing' | 'resolved';
    dateReported: string;
    reportCount: number;
}

interface ReportItemProps {
    report: Report;
    isSelected: boolean;
    onClick: () => void;
}

export const ReportItem: React.FC<ReportItemProps> = ({ report, isSelected, onClick }) => {
    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Get status icon and color
    const getStatusIndicator = () => {
        switch (report.status) {
            case 'pending':
                return {
                    icon: <Clock size={16} className="text-amber-600" />,
                    text: 'Pending',
                    bgColor: 'bg-amber-100',
                    textColor: 'text-amber-800'
                };
            case 'reviewing':
                return {
                    icon: <AlertTriangle size={16} className="text-blue-600" />,
                    text: 'Reviewing',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800'
                };
            case 'resolved':
                return {
                    icon: <CheckCircle2 size={16} className="text-green-600" />,
                    text: 'Resolved',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800'
                };
        }
    };

    const statusIndicator = getStatusIndicator();

    return (
        <div className={`p-4 hover:bg-gray-50 ${isSelected ? 'bg-gray-50' : ''}`}>
            <div className="flex items-start justify-between" onClick={onClick}>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <img src={report.reporter.avatar} alt={report.reporter.name} className="w-10 h-10 rounded-full" />
                    </div>

                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{report.reporter.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusIndicator.bgColor} ${statusIndicator.textColor}`}>
                                {statusIndicator.icon}
                                <span className="ml-1">{statusIndicator.text}</span>
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Reason:</span> {report.reason}
                        </p>

                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock size={12} className="mr-1" />
                            <span>{formatDate(report.dateReported)}</span>

                            {report.reportCount > 1 && (
                                <>
                                    <span className="mx-1">•</span>
                                    <Flag size={12} className="mr-1 text-red-500" />
                                    <span className="text-red-500">Reported {report.reportCount} times</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-16 h-28 rounded-md overflow-hidden flex-shrink-0">
                        <img src={report.video.thumbnail} alt={report.video.title} className="w-full h-full object-cover" />
                    </div>
                    {isSelected ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isSelected && (
                <div className="mt-4 ml-14 bg-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h4 className="font-medium text-gray-900">Report Details</h4>
                            <p className="text-sm text-gray-600 mt-1">{report.details}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg shadow-sm hover:bg-indigo-700">
                                View Video
                            </button>
                            <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded-lg shadow-sm hover:bg-gray-50">
                                Reporter History
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                        <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded-lg shadow-sm hover:bg-gray-50">
                            Dismiss Report
                        </button>
                        <button className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg shadow-sm hover:bg-red-200">
                            Remove Video
                        </button>
                        <button className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs rounded-lg shadow-sm hover:bg-amber-200">
                            Warn Creator
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};