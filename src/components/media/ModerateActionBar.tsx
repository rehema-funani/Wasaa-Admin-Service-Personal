import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Flag, MessageCircle, UserX } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    creator: string;
}

interface ModerateActionBarProps {
    video: Video;
}

export const ModerateActionBar: React.FC<ModerateActionBarProps> = ({ video }) => {
    const [reason, setReason] = useState('');

    const handleApprove = () => {
        console.log('Approved video:', video.id);
        // Call API to approve video
    };

    const handleReject = () => {
        console.log('Rejected video:', video.id, 'Reason:', reason);
        // Call API to reject video with reason
    };

    const handleEscalate = () => {
        console.log('Escalated video:', video.id);
        // Call API to escalate video to policy officer
    };

    return (
        <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleApprove}
                        className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                    >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                    </button>

                    <div className="relative inline-block">
                        <button className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                            <XCircle size={16} className="mr-2" />
                            Reject
                        </button>

                        <div className="absolute mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 hidden group-hover:block">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="">Select reason</option>
                                <option value="nudity">Nudity/Sexual Content</option>
                                <option value="hate">Hate Speech</option>
                                <option value="violence">Violence</option>
                                <option value="copyright">Copyright Infringement</option>
                                <option value="spam">Spam/Misleading</option>
                            </select>
                            <button
                                onClick={handleReject}
                                disabled={!reason}
                                className="mt-2 w-full px-3 py-1.5 bg-red-600 text-white rounded-md disabled:opacity-50"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleEscalate}
                        className="flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"
                    >
                        <AlertTriangle size={16} className="mr-2" />
                        Escalate
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <MessageCircle size={16} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Flag size={16} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <UserX size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};