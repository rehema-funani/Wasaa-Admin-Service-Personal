import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, Eye, Play, Clock } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

const LivestreamMetrics = () => {
  const data = [
    { name: "Mon", streams: 85, viewers: 1240 },
    { name: "Tue", streams: 72, viewers: 980 },
    { name: "Wed", streams: 90, viewers: 1380 },
    { name: "Thu", streams: 110, viewers: 1520 },
    { name: "Fri", streams: 125, viewers: 1780 },
    { name: "Sat", streams: 135, viewers: 2100 },
    { name: "Sun", streams: 115, viewers: 1850 },
  ];

  const metrics = [
    {
      title: "Active Streams",
      value: "28",
      change: "+15%",
      icon: <Play size={16} className="text-white" />,
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      title: "Current Viewers",
      value: "1,845",
      change: "+32%",
      icon: <Eye size={16} className="text-white" />,
      gradient: "from-pink-500 to-rose-600",
    },
    {
      title: "Avg. Duration",
      value: "48 min",
      change: "+8%",
      icon: <Clock size={16} className="text-white" />,
      gradient: "from-blue-500 to-cyan-600",
    },
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
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
              transition: { duration: 0.2 },
            }}
          >
            <div className={`h-1.5 bg-gradient-to-r ${metric.gradient}`}></div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} mr-3`}
                  >
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-500">{metric.title}</span>
                </div>
                <div className="flex items-center text-emerald-600 text-xs font-medium bg-emerald-50 rounded-full px-2 py-0.5">
                  <ArrowUpRight size={12} className="mr-0.5" />
                  {metric.change}
                </div>
              </div>
              <div className="text-xl font-bold text-gray-800">
                {metric.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div
        className="mt-2 h-[140px] bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          transition: { duration: 0.2 },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            barSize={12}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dx={-5}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dx={5}
            />
            {/* <Tooltip content={<CustomTooltip />} /> */}
            <Bar
              yAxisId="left"
              dataKey="streams"
              fill="#a855f7"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="viewers"
              fill="#ec4899"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default LivestreamMetrics;
