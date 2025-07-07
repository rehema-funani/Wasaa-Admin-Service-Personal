import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, ComposedChart
} from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, TrendingUp,
  CreditCard, Wallet, DollarSign
} from 'lucide-react';
import CustomTooltip from './CustomTooltip';

const WalletMetrics = () => {
  // Weekly financial data
  const data = [
    { name: 'Mon', deposits: 15200, withdrawals: 8700, net: 6500 },
    { name: 'Tue', deposits: 21500, withdrawals: 12400, net: 9100 },
    { name: 'Wed', deposits: 18300, withdrawals: 10200, net: 8100 },
    { name: 'Thu', deposits: 24100, withdrawals: 13800, net: 10300 },
    { name: 'Fri', deposits: 32400, withdrawals: 15600, net: 16800 },
    { name: 'Sat', deposits: 27800, withdrawals: 14200, net: 13600 },
    { name: 'Sun', deposits: 22500, withdrawals: 11300, net: 11200 }
  ];

  // Metrics cards data
  const metrics = [
    {
      title: 'Total Deposits',
      value: '$162,480',
      change: '+24%',
      isPositive: true,
      icon: <Wallet size={16} className="text-white" />,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Total Withdrawals',
      value: '$86,240',
      change: '+8%',
      isPositive: true,
      icon: <CreditCard size={16} className="text-white" />,
      gradient: 'from-cyan-500 to-teal-600'
    },
    {
      title: 'Net Flow',
      value: '$76,240',
      change: '-5%',
      isPositive: false,
      icon: <DollarSign size={16} className="text-white" />,
      gradient: 'from-emerald-500 to-green-600'
    }
  ];

  return (
    <div>
      {/* Metrics cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
              y: -3,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              transition: { duration: 0.2 }
            }}
          >
            <div className={`h-1.5 bg-gradient-to-r ${metric.gradient}`}></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} mr-3`}>
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-500">{metric.title}</span>
                </div>
                <div className={`flex items-center text-xs font-medium ${metric.isPositive
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-red-600 bg-red-50'
                  } rounded-full px-2 py-0.5`}>
                  {metric.isPositive
                    ? <ArrowUpRight size={12} className="mr-0.5" />
                    : <ArrowDownRight size={12} className="mr-0.5" />
                  }
                  {metric.change}
                </div>
              </div>
              <div className="text-xl font-bold text-gray-800">{metric.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Area chart */}
      <motion.div
        className="mt-2 h-[140px] bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          transition: { duration: 0.2 }
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              dx={-5}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Area
              type="monotone"
              dataKey="deposits"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDeposits)"
            />
            <Area
              type="monotone"
              dataKey="withdrawals"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWithdrawals)"
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: '#10b981' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default WalletMetrics;
