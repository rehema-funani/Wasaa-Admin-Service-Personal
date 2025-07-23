import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  Activity,
} from "lucide-react";
import financeService from "../../api/services/finance";

const TransactionStats: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState([]);

  const fetchTransactionStats = async () => {
    setIsLoading(true);
    try {
      const response = await financeService.getTransactionStats();
      if (response.status && response.data) {
        const formattedStats = formatStatsData(response.data);
        setStatsData(formattedStats);
      }
    } catch (error) {
      console.error("Failed to fetch transaction stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "KES 0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (numValue >= 1e24) {
      const exponent = Math.floor(Math.log10(numValue));
      const mantissa = numValue / Math.pow(10, exponent);
      return `KES ${mantissa.toFixed(2)}e+${exponent}`;
    }

    if (numValue >= 1e21) return `KES ${(numValue / 1e21).toFixed(2)}S`;
    if (numValue >= 1e18) return `KES ${(numValue / 1e18).toFixed(2)}Q`;
    if (numValue >= 1e15) return `KES ${(numValue / 1e15).toFixed(2)}P`;
    if (numValue >= 1e12) return `KES ${(numValue / 1e12).toFixed(2)}T`; 
    if (numValue >= 1e9) return `KES ${(numValue / 1e9).toFixed(2)}B`;
    if (numValue >= 1e6) return `KES ${(numValue / 1e6).toFixed(2)}M`;
    if (numValue >= 1e3) return `KES ${(numValue / 1e3).toFixed(2)}K`; 

    return `KES ${numValue.toFixed(2)}`;
  };

  const formatChange = (value) => {
    if (value === null || value === undefined) return "0%";

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const absValue = Math.abs(numValue);

    if (absValue >= 1e24) {
      const exponent = Math.floor(Math.log10(absValue));
      const mantissa = absValue / Math.pow(10, exponent);
      return `${mantissa.toFixed(2)}e+${exponent}%`;
    }

    if (absValue >= 1e21) return `${(absValue / 1e21).toFixed(2)}S%`;
    if (absValue >= 1e18) return `${(absValue / 1e18).toFixed(2)}Q%`;
    if (absValue >= 1e15) return `${(absValue / 1e15).toFixed(2)}P%`;
    if (absValue >= 1e12) return `${(absValue / 1e12).toFixed(2)}T%`;
    if (absValue >= 1e9) return `${(absValue / 1e9).toFixed(2)}B%`;
    if (absValue >= 1e6) return `${(absValue / 1e6).toFixed(2)}M%`;
    if (absValue >= 1e3) return `${(absValue / 1e3).toFixed(2)}K%`;

    return `${absValue.toFixed(2)}%`;
  };

  const formatStatsData = (data) => {
    return [
      {
        title: "Total Volume",
        value: formatCurrency(data.totalVolume),
        trend: data.volumeChange >= 0 ? "up" : "down",
        change: formatChange(data.volumeChange),
        period: "vs prev month",
        color: "primary",
        icon: <DollarSign size={20} />,
      },
      {
        title: "Total Transactions",
        value: data.totalCount.toLocaleString(),
        trend: data.countChange >= 0 ? "up" : "down",
        change: `${Math.abs(data.countChange)}`,
        period: "vs prev month",
        color: "green",
        icon: <CreditCard size={20} />,
      },
      {
        title: "Avg Transaction Value",
        value: formatCurrency(data.avgVolume),
        trend: data.avgVolumeTrend >= 0 ? "up" : "down",
        change: formatChange(data.avgVolumeTrend),
        period: "vs prev month",
        color: "purple",
        icon: <Activity size={20} />,
      },
      {
        title: "Avg Transactions",
        value: data.avgCount.toLocaleString(),
        trend: data.avgCountTrend >= 0 ? "up" : "down",
        change: `${Math.abs(data.avgCountTrend)}`,
        period: "per month",
        color: "orange",
        icon: <Users size={20} />,
      },
    ];
  };

  useEffect(() => {
    fetchTransactionStats();
  }, []);

  if (isLoading) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <div className="flex items-center mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                ) : (
                  <TrendingDown size={16} className="text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 text-xs ml-1">
                  {stat.period}
                </span>
              </div>
            </div>
            <div
              className={`
                p-3 rounded-lg
                ${
                  stat.color === "primary"
                    ? "bg-primary-100 text-primary-600"
                    : stat.color === "green"
                    ? "bg-green-100 text-green-600"
                    : stat.color === "purple"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-orange-100 text-orange-600"
                }
              `}
            >
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TransactionStats;
