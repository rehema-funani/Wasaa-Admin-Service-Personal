import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const VolumeTrends = ({ volumeData, formatCurrency }) => {
  // transform API response
  const mappedData = volumeData.map((item) => ({
    name: item.monthName,
    volume: Number(item.total),
  }));

  if (!mappedData.length) {
    return <div className="text-gray-500">No volume data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={mappedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#6366f1"
          strokeWidth={3}
          dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VolumeTrends;
