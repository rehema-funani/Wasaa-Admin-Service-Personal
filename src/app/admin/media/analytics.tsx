import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    BarChart3, TrendingUp, Flag, Clock, Users,
    Video, MessageSquare, Download, Calendar, Filter
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'moderation'>('overview');
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Set active tab based on URL
    useEffect(() => {
        if (location.pathname.includes('/videos')) {
            setActiveTab('videos');
        } else if (location.pathname.includes('/moderation')) {
            setActiveTab('moderation');
        } else {
            setActiveTab('overview');
        }
    }, [location]);

    // For demo purposes, we'll just use placeholders instead of actual charts
    const renderPlaceholderChart = (height: number = 300) => (
        <div
            className={`w-full h-[${height}px] bg-gray-100 rounded-lg flex items-center justify-center`}
            style={{ height: `${height}px` }}
        >
            <p className="text-gray-400">Chart Placeholder - Would use Chart.js or Recharts in actual implementation</p>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-medium">Analytics & Insights</h1>
                    <p className="text-gray-500 text-sm mt-1">Metrics and performance data for the Shorts module</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-0.5">
                        {(['7d', '30d', '90d'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === range ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition-all text-sm">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'overview'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BarChart3 size={16} className="mr-2" />
                            Overview
                        </button>

                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'videos'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Video size={16} className="mr-2" />
                            Video Performance
                        </button>

                        <button
                            onClick={() => setActiveTab('moderation')}
                            className={`px-6 py-3 text-sm font-medium flex items-center ${activeTab === 'moderation'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Flag size={16} className="mr-2" />
                            Moderation Metrics
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Video size={20} className="text-primary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Total Videos</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">125,763</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+12.5% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users size={20} className="text-green-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Active Creators</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">8,425</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+8.2% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Flag size={20} className="text-amber-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Reported Content</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">543</p>
                            <p className="text-xs text-red-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+3.7% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Clock size={20} className="text-primary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Avg. Resolution Time</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">1h 14m</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1 transform rotate-180" />
                                <span>-18.3% from previous period</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2 p-5">
                            <h2 className="text-lg font-medium mb-4">Upload Trends</h2>
                            {renderPlaceholderChart()}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h2 className="text-lg font-medium mb-4">Content Categories</h2>
                            {renderPlaceholderChart()}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'videos' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Video size={20} className="text-primary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Total Views</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">28.4M</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+22.5% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MessageSquare size={20} className="text-green-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Comments</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">1.2M</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+15.8% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Calendar size={20} className="text-amber-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Avg. Watch Time</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">27.5s</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+3.2% from previous period</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h2 className="text-lg font-medium mb-4">Views by Region</h2>
                            {renderPlaceholderChart()}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h2 className="text-lg font-medium mb-4">Top Performing Videos</h2>
                            {renderPlaceholderChart()}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <h2 className="text-lg font-medium mb-4">Engagement Trends</h2>
                        {renderPlaceholderChart()}
                    </div>
                </>
            )}

            {activeTab === 'moderation' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Flag size={20} className="text-primary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Videos Flagged</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">1,247</p>
                            <p className="text-xs text-red-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+7.3% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Clock size={20} className="text-green-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">SLA Compliance</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">98.2%</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+2.1% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Users size={20} className="text-amber-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Strikes Issued</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">287</p>
                            <p className="text-xs text-red-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+12.4% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Video size={20} className="text-primary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-700">Content Takedowns</h3>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">183</p>
                            <p className="text-xs text-red-600 mt-1 flex items-center">
                                <TrendingUp size={12} className="mr-1" />
                                <span>+8.7% from previous period</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h2 className="text-lg font-medium mb-4">Violation Categories</h2>
                            {renderPlaceholderChart()}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h2 className="text-lg font-medium mb-4">Resolution Times</h2>
                            {renderPlaceholderChart()}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <h2 className="text-lg font-medium mb-4">AI Moderation Effectiveness</h2>
                        {renderPlaceholderChart()}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsPage;