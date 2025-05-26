import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { ArrowUpRight, Eye, Play, Clock } from 'lucide-react';

const LivestreamMetrics: React.FC = () => {
    const data = [
        { name: 'Mon', streams: 85, viewers: 1240 },
        { name: 'Tue', streams: 72, viewers: 980 },
        { name: 'Wed', streams: 90, viewers: 1380 },
        { name: 'Thu', streams: 110, viewers: 1520 },
        { name: 'Fri', streams: 125, viewers: 1780 },
        { name: 'Sat', streams: 135, viewers: 2100 },
        { name: 'Sun', streams: 115, viewers: 1850 }
    ];

    const metrics = [
        {
            title: 'Active Streams',
            value: '28',
            change: '+15%',
            icon: <Play size={16} className="text-purple-500" strokeWidth={1.8} />
        },
        {
            title: 'Current Viewers',
            value: '1,845',
            change: '+32%',
            icon: <Eye size={16} className="text-pink-500" strokeWidth={1.8} />
        },
        {
            title: 'Avg. Duration',
            value: '48 min',
            change: '+8%',
            icon: <Clock size={16} className="text-primary-500" strokeWidth={1.8} />
        }
    ];

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                    <p className="text-gray-600 text-xs mb-1">{label}</p>
                    <p className="text-sm font-medium text-purple-600 mb-1">
                        {`Streams: ${payload[0]?.value}`}
                    </p>
                    <p className="text-sm font-medium text-pink-500">
                        {`Viewers: ${payload[1]?.value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        className="bg-gray-50/70 rounded-xl p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -2, backgroundColor: 'rgba(238, 242, 255, 0.5)' }}
                    >
                        <div className="flex items-center mb-1">
                            <div className="p-1.5 rounded-lg bg-white mr-2">
                                {metric.icon}
                            </div>
                            <span className="text-xs text-gray-500">{metric.title}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-800">{metric.value}</span>
                            <div className="flex items-center text-green-600 text-xs">
                                <ArrowUpRight size={12} className="mr-0.5" />
                                {metric.change}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="mt-2 h-[150px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            dx={-10}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            dx={10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar yAxisId="left" dataKey="streams" fill="#c084fc" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="viewers" fill="#f472b6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default LivestreamMetrics;