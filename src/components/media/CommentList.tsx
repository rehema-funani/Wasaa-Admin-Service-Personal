import React, { useState, useEffect } from 'react';
import { MoreHorizontal, ThumbsUp, ThumbsDown, Flag, Trash, CornerDownRight } from 'lucide-react';

interface Comment {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    likes: number;
    dislikes: number;
    flags: number;
    timestamp: string;
    replies?: Comment[];
}

interface CommentListProps {
    videoId: string;
    filter: string;
    search: string;
}

export const CommentList: React.FC<CommentListProps> = ({ videoId, filter, search }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data generation for comments
    useEffect(() => {
        // In a real application, fetch from API
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const mockComments = Array(15).fill(null).map((_, i) => ({
                id: `comment-${i}`,
                user: {
                    id: `user-${i + 200}`,
                    name: `Commenter ${i + 1}`,
                    avatar: `https://i.pravatar.cc/150?u=${i + 200}`
                },
                content: `This is a sample comment ${i + 1}. It might contain some potentially problematic content that needs moderation.`,
                likes: Math.floor(Math.random() * 50),
                dislikes: Math.floor(Math.random() * 10),
                flags: Math.floor(Math.random() * 5),
                timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                replies: i % 3 === 0 ? [
                    {
                        id: `reply-${i}-1`,
                        user: {
                            id: `user-${i + 500}`,
                            name: `Replier ${i + 1}`,
                            avatar: `https://i.pravatar.cc/150?u=${i + 500}`
                        },
                        content: `This is a reply to comment ${i + 1}.`,
                        likes: Math.floor(Math.random() * 10),
                        dislikes: Math.floor(Math.random() * 5),
                        flags: Math.floor(Math.random() * 2),
                        timestamp: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
                    }
                ] : undefined
            }));

            // Apply filter
            let filteredComments = mockComments;
            if (filter === 'flagged') {
                filteredComments = mockComments.filter(comment => comment.flags > 0);
            } else if (filter === 'reported') {
                filteredComments = mockComments.filter(comment => comment.flags > 2);
            }

            // Apply search
            if (search) {
                filteredComments = filteredComments.filter(comment =>
                    comment.content.toLowerCase().includes(search.toLowerCase()) ||
                    comment.user.name.toLowerCase().includes(search.toLowerCase())
                );
            }

            setComments(filteredComments);
            setLoading(false);
        }, 500);
    }, [videoId, filter, search]);

    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const handleDeleteComment = (commentId: string) => {
        setComments(comments.filter(comment => comment.id !== commentId));
        // In a real app, call API to delete comment
    };

    if (loading) {
        return <div className="text-center py-10">Loading comments...</div>;
    }

    if (comments.length === 0) {
        return <div className="text-center py-10">No comments found.</div>;
    }

    return (
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start space-x-3">
                        <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full" />

                        <div className="flex-grow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">{comment.user.name}</h4>
                                    <p className="text-xs text-gray-500">{formatDate(comment.timestamp)}</p>
                                </div>

                                <div className="flex items-center">
                                    {comment.flags > 0 && (
                                        <span className="mr-2 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs flex items-center">
                                            <Flag size={10} className="mr-1" />
                                            {comment.flags}
                                        </span>
                                    )}

                                    <div className="relative group">
                                        <button className="p-1 rounded-full hover:bg-gray-100">
                                            <MoreHorizontal size={16} />
                                        </button>

                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden group-hover:block z-10">
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="flex items-center w-full px-2 py-1 text-left text-sm text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash size={14} className="mr-2" />
                                                Delete Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-1 text-gray-700 text-sm">{comment.content}</p>

                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                    <ThumbsUp size={12} className="mr-1" />
                                    <span>{comment.likes}</span>
                                </div>

                                <div className="flex items-center">
                                    <ThumbsDown size={12} className="mr-1" />
                                    <span>{comment.dislikes}</span>
                                </div>
                            </div>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                    {comment.replies.map(reply => (
                                        <div key={reply.id} className="mt-2">
                                            <div className="flex items-start space-x-2">
                                                <img src={reply.user.avatar} alt={reply.user.name} className="w-6 h-6 rounded-full" />

                                                <div>
                                                    <div className="flex items-start">
                                                        <div>
                                                            <h5 className="font-medium text-gray-900 text-xs">{reply.user.name}</h5>
                                                            <p className="text-xs text-gray-500">{formatDate(reply.timestamp)}</p>
                                                        </div>
                                                    </div>

                                                    <p className="mt-1 text-gray-700 text-xs">{reply.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};