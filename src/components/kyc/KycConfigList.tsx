import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight, AlertCircle, Plus, Clock, Calendar, Settings, Shield, FileCheck, Info, DollarSign, Users, Star, Zap } from 'lucide-react';
import KycLevelIcon from './KycLevelIcon';
import TransactionTypeIcon from './TransactionTypeIcon';
import { KycConfig, TransactionType } from '../../types/kyc';
import { motion, AnimatePresence } from 'framer-motion';

interface KycConfigListProps {
    kycConfigs: KycConfig[];
    expandedRows: Record<string, boolean>;
    toggleRowExpansion: (id: string) => void;
    openEditModal: (config: KycConfig) => void;
    openDeleteModal: (config: KycConfig) => void;
    openEditLimitsModal: (config: KycConfig, transactionType: TransactionType) => void;
    openAddLimitModal: (config: KycConfig) => void;
}

const KycConfigList: React.FC<KycConfigListProps> = ({
    kycConfigs,
    expandedRows,
    toggleRowExpansion,
    openEditModal,
    openDeleteModal,
    openEditLimitsModal,
    openAddLimitModal
}) => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const formatTransactionType = (type: TransactionType | null): string => {
        if (!type) return '';

        switch (type) {
            case 'send':
                return 'Send Money';
            case 'WITHDRAW':
                return 'Withdraw to Bank';
            case 'withdraw_mpesa':
                return 'Withdraw to M-Pesa';
            case 'transfer':
                return 'Transfer Between Accounts';
            case 'gift':
                return 'Gift to User';
            default:
                return String(type).replace('_', ' ');
        }
    };

    const formatCurrency = (amount: number): string => {
        return `KES ${amount.toLocaleString()}`;
    };

    const getLevelGradient = (level: string) => {
        switch (level) {
            case 'basic':
                return 'from-emerald-400 to-teal-500';
            case 'standard':
                return 'from-blue-400 to-indigo-500';
            case 'advanced':
                return 'from-purple-400 to-pink-500';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'basic':
                return <Users size={20} className="text-white" />;
            case 'standard':
                return <Star size={20} className="text-white" />;
            case 'advanced':
                return <Zap size={20} className="text-white" />;
            default:
                return <Shield size={20} className="text-white" />;
        }
    };

    const getTransactionLimitCardStyle = (type: TransactionType) => {
        switch (type) {
            case 'send':
                return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50';
            case 'WITHDRAW':
                return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50';
            case 'withdraw_mpesa':
                return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50';
            case 'transfer':
                return 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50';
            case 'gift':
                return 'border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100/50';
            default:
                return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50';
        }
    };

    if (kycConfigs.length === 0) {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-12">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No KYC Levels Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        There are no KYC levels matching your search criteria. Try adjusting your filters or create a new KYC level to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {kycConfigs.map((config, index) => (
                <motion.div
                    key={config.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden transition-all duration-300 ${hoveredCard === config.id ? 'shadow-xl shadow-gray-200/50 border-gray-300/50' : 'shadow-sm'
                        }`}
                    onMouseEnter={() => setHoveredCard(config.id!)}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    {/* Main Card Content */}
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            {/* Left Side - Level Info */}
                            <div className="flex items-start space-x-4">
                                {/* Level Badge */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${getLevelGradient(config.level)} rounded-xl flex items-center justify-center shadow-lg`}>
                                    {getLevelIcon(config.level)}
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${config.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'
                                                } mr-1.5`}></span>
                                            {config.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${config.level === 'basic' ? 'bg-emerald-100 text-emerald-700' :
                                                config.level === 'standard' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                            }`}>
                                            {config.level} Level
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 leading-relaxed max-w-2xl">
                                        {config.description}
                                    </p>

                                    {/* Requirements */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {config.requirements.slice(0, 3).map((req, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                                            >
                                                <FileCheck size={12} className="mr-1.5 text-gray-500" />
                                                {req}
                                            </span>
                                        ))}
                                        {config.requirements.length > 3 && (
                                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg">
                                                +{config.requirements.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <Clock size={12} className="mr-1.5" />
                                            Updated {config.lastUpdated}
                                        </div>
                                        <div className="flex items-center">
                                            <Settings size={12} className="mr-1.5" />
                                            {config.transactionLimits?.length || 0} transaction types
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Actions */}
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    onClick={() => toggleRowExpansion(config.id!)}
                                    className={`p-3 rounded-xl transition-all ${expandedRows[config.id!]
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={expandedRows[config.id!] ? "Hide transaction limits" : "Show transaction limits"}
                                >
                                    <motion.div
                                        animate={{ rotate: expandedRows[config.id!] ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={18} />
                                    </motion.div>
                                </motion.button>

                                <motion.button
                                    onClick={() => openEditModal(config)}
                                    className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Edit KYC Level"
                                >
                                    <Edit size={18} />
                                </motion.button>

                                <motion.button
                                    onClick={() => openDeleteModal(config)}
                                    className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Delete KYC Level"
                                >
                                    <Trash2 size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Transaction Limits */}
                    <AnimatePresence>
                        {expandedRows[config.id!] && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="border-t border-gray-200/50 bg-gradient-to-b from-gray-50/30 to-white/50"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                                <Settings size={20} className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">Transaction Limits</h4>
                                                <p className="text-sm text-gray-600">Configure limits for different transaction types</p>
                                            </div>
                                        </div>

                                        <motion.button
                                            onClick={() => openAddLimitModal(config)}
                                            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Plus size={16} />
                                            <span>Add Limit</span>
                                        </motion.button>
                                    </div>

                                    {config.transactionLimits && config.transactionLimits.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {config.transactionLimits.map((limit, limitIndex) => (
                                                <motion.div
                                                    key={limit.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: limitIndex * 0.1 }}
                                                    className={`relative p-5 rounded-xl border ${getTransactionLimitCardStyle(limit.transactionType)} backdrop-blur-sm transition-all duration-200 hover:shadow-md ${!limit.isAllowed ? 'opacity-60' : ''
                                                        }`}
                                                >
                                                    {/* Header */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                                                <TransactionTypeIcon type={limit.transactionType} size={24} />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-medium text-gray-900 text-sm">
                                                                    {formatTransactionType(limit.transactionType)}
                                                                </h5>
                                                                {!limit.isAllowed && (
                                                                    <span className="flex items-center text-xs text-red-600 mt-1">
                                                                        <AlertCircle size={12} className="mr-1" />
                                                                        Disabled
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <motion.button
                                                            onClick={() => openEditLimitsModal(config, limit.transactionType)}
                                                            className="p-2 rounded-lg bg-white/60 hover:bg-white hover:shadow-sm text-gray-500 hover:text-indigo-600 transition-all"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            title="Edit Limits"
                                                        >
                                                            <Settings size={16} />
                                                        </motion.button>
                                                    </div>

                                                    {/* Limits Display */}
                                                    <div className="space-y-3">
                                                        {limit.isDailyLimitEnabled && (
                                                            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-white/50">
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar size={14} className="text-blue-500" />
                                                                    <span className="text-xs font-medium text-gray-700">Daily</span>
                                                                </div>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {formatCurrency(limit.dailyLimit)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {limit.isWeeklyLimitEnabled && (
                                                            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-white/50">
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar size={14} className="text-purple-500" />
                                                                    <span className="text-xs font-medium text-gray-700">Weekly</span>
                                                                </div>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {formatCurrency(limit.weeklyLimit)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {limit.isMonthlyLimitEnabled && (
                                                            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-white/50">
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar size={14} className="text-green-500" />
                                                                    <span className="text-xs font-medium text-gray-700">Monthly</span>
                                                                </div>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {formatCurrency(limit.monthlyLimit)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {(limit.isPerTransactionMinEnabled || limit.isPerTransactionMaxEnabled) && (
                                                            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-white/50">
                                                                <div className="flex items-center space-x-2">
                                                                    <DollarSign size={14} className="text-amber-500" />
                                                                    <span className="text-xs font-medium text-gray-700">Per Transaction</span>
                                                                </div>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {limit.isPerTransactionMinEnabled && limit.isPerTransactionMaxEnabled && (
                                                                        `${formatCurrency(limit.perTransactionMin)} - ${formatCurrency(limit.perTransactionMax)}`
                                                                    )}
                                                                    {limit.isPerTransactionMinEnabled && !limit.isPerTransactionMaxEnabled && (
                                                                        `Min: ${formatCurrency(limit.perTransactionMin)}`
                                                                    )}
                                                                    {!limit.isPerTransactionMinEnabled && limit.isPerTransactionMaxEnabled && (
                                                                        `Max: ${formatCurrency(limit.perTransactionMax)}`
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Status Indicator */}
                                                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${limit.isAllowed ? 'bg-emerald-400' : 'bg-red-400'
                                                        }`}></div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Info size={24} className="text-indigo-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transaction Limits</h3>
                                            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                                                Add transaction limits to define what operations users with this KYC level can perform and their associated limits.
                                            </p>
                                            <motion.button
                                                onClick={() => openAddLimitModal(config)}
                                                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Plus size={18} />
                                                <span>Add Your First Limit</span>
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};

export default KycConfigList;