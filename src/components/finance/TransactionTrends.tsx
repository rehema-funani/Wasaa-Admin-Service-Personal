import React, { useEffect } from "react";
import { motion } from "framer-motion";
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
import financeService from "../../api/services/finance";

const TransactionTrends = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [transactionsData, setTransactionsData] = React.useState([]);

  const fetchTransactionTrends = async () => {
    setIsLoading(true);
    try {
      const res = await financeService.getMonthylyTransactionTrends();
      if (res.data && Array.isArray(res.data)) {
        const transformedData = transformApiData(res.data);
        setTransactionsData(transformedData);
      }
    } catch (error) {
      console.error("Failed to fetch transaction trends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionTrends();
  }, []);

  const transformApiData = (data) => {
    return data.map((item) => {
      const monthName = item.month_name.trim();

      const count = parseInt(item.count, 10);
      let volume = parseFloat(item.volume);
      if (volume > 1e12) {
        volume = 1e12;
      }

      return {
        name: monthName,
        count: count,
        amount: volume,
      };
    });
  };

  const formatCurrency = (value) => {
    if (value >= 1e12) return "≥Ksh 1T";
    if (value >= 1e9) return `Ksh ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `Ksh ${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `Ksh ${(value / 1e3).toFixed(1)}K`;
    return `Ksh ${value}`;
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Transaction Trends
          </h3>
          <p className="text-gray-500 text-sm">
            Monthly transaction volume and count
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-500 mr-1"></div>
            <span className="text-xs text-gray-600">Count</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs text-gray-600">Amount</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={transactionsData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Transaction Amount") {
                    return [formatCurrency(value), name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                activeDot={{ r: 8 }}
                name="Transaction Count"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                name="Transaction Amount"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Display note about potentially large values */}
      {!isLoading && transactionsData.some((item) => item.amount >= 1e12) && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Note: Some volume values are extremely large and have been capped for
          visualization purposes.
        </div>
      )}
    </motion.div>
  );
};

export default TransactionTrends;
