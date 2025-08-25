import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { motion } from "framer-motion";

const LoginTypesPieChart = () => {
  // Updated color scheme to match fintech aesthetic
  const data = [
    { name: "Mobile", value: 68, color: "#3b82f6" }, // blue-500
    { name: "Desktop", value: 26, color: "#6366f1" }, // indigo-500
    { name: "Tablet", value: 6, color: "#8b5cf6" }, // violet-500
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.1 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: payload[0].payload.color }}
          >
            {payload[0].name}
          </p>
          <p className="text-lg font-semibold" style={{ color: "#1f2937" }}>
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-[220px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={85}
            innerRadius={45}
            paddingAngle={3}
            dataKey="value"
            animationDuration={1500}
            animationBegin={300}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="white"
                strokeWidth={3}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LoginTypesPieChart;
