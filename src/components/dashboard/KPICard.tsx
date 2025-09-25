import React from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, isPositive, icon, gradient, description, className }) => (
  <motion.div
    className={[
      `relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`,
      gradient,
      className
    ].filter(Boolean).join(' ')}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
      <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
        isPositive ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-100'
      }`}>
        {change}
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">{title}</h3>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-xs text-white/70">{description}</p>
    </div>
  </motion.div>
);
