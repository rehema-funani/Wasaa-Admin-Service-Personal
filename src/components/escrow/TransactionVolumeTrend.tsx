import { Maximize2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TransactionVolumeTrend = ({
  transactionTrendData,
  selectedMetric,
  setSelectedMetric,
  formatCurrency,
  formatNumber,
  CustomTooltip,
  weekLabel,
  handleWeekChange,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Transaction Volume Trend
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daily volume and transaction count over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <button
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleWeekChange(-1)}
            >
              ← Prev Week
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {weekLabel}
            </span>
            <button
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleWeekChange(1)}
            >
              Next Week →
            </button>
          </div>

          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transactionTrendData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) =>
                selectedMetric === "volume"
                  ? formatCurrency(value)
                  : formatNumber(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionVolumeTrend;
