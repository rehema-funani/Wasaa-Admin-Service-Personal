import { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTooltip from './CustomTooltip';

const UserActivityChart = ({ timeframe, dataType }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateChartData(timeframe, dataType);
      setChartData(data);
      setIsLoading(false);
    }, 600);
  }, [timeframe, dataType]);

  const generateChartData = (timeframe, dataType) => {
    let data = [];
    let baseValue = dataType === 'users' ? 2500 : dataType === 'groups' ? 500 : 30000;
    let fluctuation = dataType === 'users' ? 800 : dataType === 'groups' ? 200 : 15000;
    let pointCount = 0;
    let format = '';

    switch (timeframe) {
      case 'day':
        pointCount = 24;
        format = 'h a';
        for (let i = 0; i < pointCount; i++) {
          const hour = i;
          const value = Math.floor(baseValue + Math.random() * fluctuation * (1 + Math.sin(i / 8) * 0.5));

          data.push({
            name: `${hour}:00`,
            [dataType]: value,
            [`${dataType}Low`]: value * 0.7
          });
        }
        break;
      case 'week':
        pointCount = 7;
        format = 'ddd';
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

  const getColorByDataType = (dataType) => {
    switch (dataType) {
      case 'users':
        return {
          stroke: '#3b82f6',
          fill: '#3b82f6',
          gradient: ['#eff6ff', '#93c5fd']
        };
      case 'groups':
        return {
          stroke: '#10b981',
          fill: '#10b981',
          gradient: ['#ecfdf5', '#6ee7b7']
        };
      case 'transactions':
        return {
          stroke: '#8b5cf6',
          fill: '#8b5cf6',
          gradient: ['#f5f3ff', '#c4b5fd']
        };
      default:
        return {
          stroke: '#3b82f6',
          fill: '#3b82f6',
          gradient: ['#eff6ff', '#93c5fd']
        };
    }
  };

  const colors = getColorByDataType(dataType);

  return (
    <div className="h-[300px] w-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            className="h-full w-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="loading"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-500">Loading data...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={`${timeframe}-${dataType}`}
            transition={{ duration: 0.3 }}
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
                  strokeWidth={3}
                  fill={`url(#gradient-${dataType})`}
                  activeDot={{ r: 8, stroke: 'white', strokeWidth: 2, fill: colors.fill }}
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
