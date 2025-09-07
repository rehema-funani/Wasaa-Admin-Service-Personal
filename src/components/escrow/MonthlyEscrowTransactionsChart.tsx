import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyEscrowTransactionsChart = ({ escrowData, formatNumber }) => {
  const mappedData = escrowData.map((item) => {
    const statuses = {
      pendingFunding: Number(item.statuses.PENDING_FUNDING),
      funded: Number(item.statuses.FUNDED),
      partiallyReleased: Number(item.statuses.PARTIALLY_RELEASED),
      released: Number(item.statuses.RELEASED),
      disputed: Number(item.statuses.DISPUTED),
      cancelled: Number(item.statuses.CANCELLED),
    };

    return {
      name: item.monthName,
      ...statuses,
      total: Object.values(statuses).reduce((sum, v) => sum + v, 0),
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                    {entry.dataKey.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 ml-4">
                  {formatNumber(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={mappedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          opacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatNumber}
        />

        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="rect"
          formatter={(value) => (
            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {value.replace(/([A-Z])/g, " $1").trim()}
            </span>
          )}
        />

        <Bar
          dataKey="pendingFunding"
          name="Pending Funding"
          fill="#fbbf24"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="funded"
          name="Funded"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="partiallyReleased"
          name="Partially Released"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="released"
          name="Released"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="disputed"
          name="Disputed"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="cancelled"
          name="Cancelled"
          fill="#6b7280"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyEscrowTransactionsChart;