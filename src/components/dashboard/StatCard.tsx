import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isPositive,
    icon,
    bgColor
}) => {
    return (
        <motion.div
            className={`relative bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-50 dark:border-dark-border overflow-hidden`}
            whileHover={{
                y: -4,
                boxShadow: '0 12px 20px rgba(0, 0, 0, 0.06)',
                transition: { duration: 0.3 }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 }
            }}
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-30 dark:opacity-20`} />

            <div className="relative p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-500 dark:text-neutral-400 text-sm mb-1">{title}</h3>
                        <p className="text-2xl font-semibold text-gray-800 dark:text-neutral-100">{value}</p>
                    </div>
                    <motion.div
                        className="p-2.5 rounded-xl bg-white/80 dark:bg-dark-active/80 backdrop-blur-sm border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-dark-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {icon}
                    </motion.div>
                </div>

                <div className="mt-3 flex items-center">
                    <div className={`flex items-center ${isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                        }`}>
                        {isPositive ? (
                            <ArrowUpRight size={16} className="mr-1" strokeWidth={1.8} />
                        ) : (
                            <ArrowDownRight size={16} className="mr-1" strokeWidth={1.8} />
                        )}
                        <span className="text-sm font-medium">{change}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-neutral-500 ml-2">vs last period</span>
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;