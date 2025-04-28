import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    TooltipProps
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface UserActivityChartProps {
    timeframe: string;
    dataType: string;
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ timeframe, dataType }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        setIsLoading(true);
        setTimeout(() => {
            const data = generateChartData(timeframe, dataType);
            setChartData(data);
            setIsLoading(false);
        }, 600);
    }, [timeframe, dataType]);

    const generateChartData = (timeframe: string, dataType: string) => {
        let data: any[] = [];
        let baseValue = dataType === 'users' ? 2500 : dataType === 'groups' ? 500 : 30000;
        let fluctuation = dataType === 'users' ? 800 : dataType === 'groups' ? 200 : 15000;
        let pointCount = 0;
        let format = '';

        switch (timeframe) {
            case 'day':
                pointCount = 24;
                format = 'h a';
                // Generate hourly data for the day
                for (let i = 0; i < pointCount; i++) {
                    const hour = i;
                    const value = Math.floor(baseValue + Math.random() * fluctuation * (1 + Math.sin(i / 8) * 0.5));

                    data.push({
                        name: `${hour}:00`,
                        [dataType]: value,
                        // Add secondary value for area below
                        [`${dataType}Low`]: value * 0.7
                    });
                }
                break;
            case 'week':
                pointCount = 7;
                format = 'ddd';
                // Generate daily data for the week
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                for (let i = 0; i < pointCount; i++) {
                    const value = Math.floor(baseValue + Math.random() * fluctuation * (1 + Math.sin(i / 3) * 0.5));

                    data.push({
                        name: days[i],
                        [dataType]: value,
                        [`${dataType}Low`]: value * 0.7
                    });
                }
                break;
            case 'month':
                pointCount = 30;
                format = 'D MMM';
                // Generate daily data for the month
                for (let i = 1; i <= pointCount; i++) {
                    const value = Math.floor(baseValue + Math.random() * fluctuation * (1 + Math.sin(i / 5) * 0.5));

                    data.push({
                        name: `${i}`,
                        [dataType]: value,
                        [`${dataType}Low`]: value * 0.7
                    });
                }
                break;
            case 'year':
                pointCount = 12;
                format = 'MMM';
                // Generate monthly data for the year
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for (let i = 0; i < pointCount; i++) {
                    const value = Math.floor(baseValue + Math.random() * fluctuation * (1 + Math.sin(i / 4) * 0.5));

                    data.push({
                        name: months[i],
                        [dataType]: value,
                        [`${dataType}Low`]: value * 0.7
                    });
                }
                break;
            default:
                break;
        }

        return data;
    };

    const getColorByDataType = (dataType: string) => {
        switch (dataType) {
            case 'users':
                return {
                    stroke: '#6366f1', // indigo-500
                    fill: '#6366f1',   // indigo-500
                    gradient: ['#eef2ff', '#c7d2fe'] // indigo-50 to indigo-200
                };
            case 'groups':
                return {
                    stroke: '#10b981', // emerald-500
                    fill: '#10b981',   // emerald-500
                    gradient: ['#ecfdf5', '#a7f3d0'] // emerald-50 to emerald-200
                };
            case 'transactions':
                return {
                    stroke: '#0ea5e9', // sky-500
                    fill: '#0ea5e9',   // sky-500
                    gradient: ['#f0f9ff', '#bae6fd'] // sky-50 to sky-200
                };
            default:
                return {
                    stroke: '#6366f1',
                    fill: '#6366f1',
                    gradient: ['#eef2ff', '#c7d2fe']
                };
        }
    };

    const colors = getColorByDataType(dataType);

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            let formattedValue = '';

            if (dataType === 'transactions') {
                formattedValue = `$${value?.toLocaleString()}`;
            } else {
                formattedValue = `${value?.toLocaleString()}`;
            }

            return (
                <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                    <p className="text-gray-600 text-xs">{label}</p>
                    <p className="text-sm font-semibold" style={{ color: colors.stroke }}>
                        {formattedValue}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[300px] w-full">
            <AnimatePresence>
                {isLoading ? (
                    <motion.div
                        className="h-full w-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="h-full w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={`${timeframe}-${dataType}`}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id={`gradient-${dataType}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.gradient[1]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={colors.gradient[0]} stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dx={-10}
                                    tickFormatter={(value) => dataType === 'transactions' ? `$${value / 1000}k` : value.toLocaleString()}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey={dataType}
                                    stroke={colors.stroke}
                                    strokeWidth={2}
                                    fill={`url(#gradient-${dataType})`}
                                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: colors.fill }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserActivityChart;