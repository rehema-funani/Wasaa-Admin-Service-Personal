import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DisputeResolution = ({ disputeData, COLORS }) => {
  const mappedData =
    disputeData && disputeData.length > 0 && disputeData[0].statuses
      ? Object.entries(disputeData[0].statuses).map(([key, value]) => ({
          name: key,
          value: Number(value),
        }))
      : [];

  if (!mappedData.length) {
    return <div className="text-gray-500">No dispute data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={mappedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {mappedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}`, name]} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default DisputeResolution;
