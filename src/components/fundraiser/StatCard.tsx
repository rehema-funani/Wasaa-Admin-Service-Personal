import React from "react";
import { motion } from "framer-motion";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  trend?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  isLoading = false,
  onClick,
  className = "",
}) => (
  <motion.div
    className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden ${
      onClick ? "cursor-pointer" : ""
    } ${className}`}
    whileHover={{ y: -4 }}
    onClick={onClick}
  >
    {isLoading ? (
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 h-8 w-8`}
          ></div>
          {trend && (
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          )}
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {subtitle && (
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
        )}
      </div>
    ) : (
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon size={18} className="text-white" />
          </div>
          {trend && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    )}

    {/* Hover effect */}
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${color}`}
    />

    {/* Subtle particle effect on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
      <div className="absolute -bottom-2 left-1/4 w-1 h-1 rounded-full bg-white/30 animate-float-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/20 animate-float-slow animation-delay-300"></div>
      <div className="absolute top-1/2 left-1/3 w-1 h-1 rounded-full bg-white/30 animate-float-slow animation-delay-700"></div>
    </div>
  </motion.div>
);

export default StatCard;
