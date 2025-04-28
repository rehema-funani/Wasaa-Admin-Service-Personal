import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, Wallet, DollarSign } from 'lucide-react';

const WalletMetrics: React.FC = () => {
    const data = [
        { name: 'Mon', deposits: 15200, withdrawals: 8700 },
        { name: 'Tue', deposits: 21500, withdrawals: 12400 },
        { name: 'Wed', deposits: 18300, withdrawals: 10200 },
        { name: 'Thu', deposits: 24100, withdrawals: 13800 },
        { name: 'Fri', deposits: 32400, withdrawals: 15600 },
        { name: 'Sat', deposits: 27800, withdrawals: 14200 },
        { name: 'Sun', deposits: 22500, withdrawals: 11300 }
    ];

    const metrics = [
        {
            title: 'Total Deposits',
            value: '$162,480',
            change: '+24%',
            isPositive: true,
            icon: <Wallet size={16} className="text-blue-500" strokeWidth={1.8} />
        },
        {
            title: 'Total Withdrawals',
            value: '$86,240',
            change: '+8%',
            isPositive: true,
            icon: <CreditCard size={16} className="text-cyan-500" strokeWidth={1.8} />
        },
        {
            title: 'Net Flow',
            value: '$76,240',
            change: '-5%',
            isPositive: false,
            icon: <DollarSign size={16} className="text-green-500" strokeWidth={1.8} />
        }
    ];

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                    <p className="text-gray-600 text-xs mb-1">{label}</p>
                    <p className="text-sm font-medium text-blue-600 mb-1">
                        {`Deposits: $${payload[0]?.value?.toLocaleString()}`}
                    </p>
                    <p className="text-sm font-medium text-cyan-500">
                        {`Withdrawals: $${payload[1]?.value?.toLocaleString()}`}
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
                            <div className={`flex items-center text-xs ${metric.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                {metric.isPositive ? (
                                    <ArrowUpRight size={12} className="mr-0.5" />
                                ) : (
                                    <ArrowDownRight size={12} className="mr-0.5" />
                                )}
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
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            dx={-10}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="deposits"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 0 }}
                            activeDot={{ r: 5, stroke: 'white', strokeWidth: 2, fill: '#3b82f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="withdrawals"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={{ r: 0 }}
                            activeDot={{ r: 5, stroke: 'white', strokeWidth: 2, fill: '#06b6d4' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default WalletMetrics;