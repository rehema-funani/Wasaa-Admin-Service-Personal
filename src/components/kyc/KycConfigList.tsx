import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight, AlertCircle, Plus, Clock, Calendar, Settings, Shield, FileCheck, Info, DollarSign } from 'lucide-react';
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
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

    const getLimitCardStyle = (type: TransactionType) => {
        switch (type) {
            case 'send':
                return 'border-blue-200 bg-gradient-to-br from-white to-blue-50';
            case 'WITHDRAW':
                return 'border-purple-200 bg-gradient-to-br from-white to-purple-50';
            case 'withdraw_mpesa':
                return 'border-green-200 bg-gradient-to-br from-white to-green-50';
            case 'transfer':
                return 'border-amber-200 bg-gradient-to-br from-white to-amber-50';
            case 'gift':
                return 'border-pink-200 bg-gradient-to-br from-white to-pink-50';
            default:
                return 'border-gray-200 bg-white';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="w-10 px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                            <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {kycConfigs.length > 0 ? (
                            kycConfigs.map((config) => (
                                <React.Fragment key={config.id}>
                                    <tr
                                        className={`${expandedRows[config.id!] ? 'bg-blue-50/80' : hoveredRow === config.id ? 'bg-gray-50/80' : 'bg-white'} transition-colors duration-200`}
                                        onMouseEnter={() => setHoveredRow(config.id!)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td className="px-3 py-4 text-center">
                                            <button
                                                onClick={() => toggleRowExpansion(config.id!)}
                                                className={`p-1.5 rounded-full transition-all duration-200 ${expandedRows[config.id!]
                                                        ? 'bg-blue-100 text-blue-600 shadow-sm'
                                                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                                    }`}
                                                title={expandedRows[config.id!] ? "Hide transaction limits" : "Show transaction limits"}
                                            >
                                                {expandedRows[config.id!] ?
                                                    <ChevronDown size={18} /> :
                                                    <ChevronRight size={18} />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <KycLevelIcon level={config.level} />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{config.name}</div>
                                            <div className="text-xs text-gray-500">Level: {config.level.charAt(0).toUpperCase() + config.level.slice(1)}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-xs text-gray-600 max-w-md line-clamp-2">{config.description}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                {config.requirements.map((req, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                    >
                                                        <FileCheck size={10} className="mr-1 text-gray-500" />
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${config.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} mr-1.5`}></span>
                                                {config.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600 text-xs whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock size={12} className="text-gray-400 mr-1.5" />
                                                {config.lastUpdated}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => openEditModal(config)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 mx-1"
                                                    title="Edit KYC Level"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(config)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 mx-1"
                                                    title="Delete KYC Level"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <AnimatePresence>
                                        {expandedRows[config.id!] && (
                                            <tr className="bg-gradient-to-b from-blue-50/60 to-white">
                                                <td colSpan={8} className="px-6 pt-1 pb-4 border-b border-blue-100">
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="py-4">
                                                            <div className="mb-4">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Settings size={18} className="text-blue-600" />
                                                                        <h4 className="text-base font-semibold text-gray-800">Transaction Limits</h4>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => openAddLimitModal(config)}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm text-sm font-medium"
                                                                    >
                                                                        <Plus size={14} />
                                                                        <span>Add Limit</span>
                                                                    </button>
                                                                </div>

                                                                {config.transactionLimits && config.transactionLimits.length > 0 ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                        {config.transactionLimits.map((limit) => (
                                                                            <div
                                                                                key={limit.id}
                                                                                className={`p-4 rounded-xl border ${getLimitCardStyle(limit.transactionType)} shadow-sm transition-all duration-200 hover:shadow-md ${!limit.isAllowed ? 'opacity-70' : ''}`}
                                                                            >
                                                                                <div className="flex justify-between items-start mb-3">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-100">
                                                                                            <TransactionTypeIcon type={limit.transactionType} size={20} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-sm font-medium text-gray-800">{formatTransactionType(limit.transactionType)}</span>
                                                                                            {!limit.isAllowed && (
                                                                                                <span className="flex items-center text-xs text-red-600 mt-0.5">
                                                                                                    <AlertCircle size={10} className="mr-0.5" />
                                                                                                    Disabled
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>

                                                                                    <button
                                                                                        onClick={() => openEditLimitsModal(config, limit.transactionType)}
                                                                                        className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                                                                        title="Edit Limits"
                                                                                    >
                                                                                        <Settings size={16} />
                                                                                    </button>
                                                                                </div>

                                                                                <div className="space-y-2.5 mt-3">
                                                                                    {limit.isDailyLimitEnabled && (
                                                                                        <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg border border-gray-100">
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <Calendar size={14} className="text-blue-500" />
                                                                                                <span className="text-xs text-gray-700">Daily Limit</span>
                                                                                            </div>
                                                                                            <span className="text-sm font-medium text-gray-900">{formatCurrency(limit.dailyLimit)}</span>
                                                                                        </div>
                                                                                    )}

                                                                                    {limit.isWeeklyLimitEnabled && (
                                                                                        <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg border border-gray-100">
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <Calendar size={14} className="text-purple-500" />
                                                                                                <span className="text-xs text-gray-700">Weekly Limit</span>
                                                                                            </div>
                                                                                            <span className="text-sm font-medium text-gray-900">{formatCurrency(limit.weeklyLimit)}</span>
                                                                                        </div>
                                                                                    )}

                                                                                    {limit.isMonthlyLimitEnabled && (
                                                                                        <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg border border-gray-100">
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <Calendar size={14} className="text-green-500" />
                                                                                                <span className="text-xs text-gray-700">Monthly Limit</span>
                                                                                            </div>
                                                                                            <span className="text-sm font-medium text-gray-900">{formatCurrency(limit.monthlyLimit)}</span>
                                                                                        </div>
                                                                                    )}

                                                                                    {(limit.isPerTransactionMinEnabled || limit.isPerTransactionMaxEnabled) && (
                                                                                        <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg border border-gray-100">
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <DollarSign size={14} className="text-amber-500" />
                                                                                                <span className="text-xs text-gray-700">Per Transaction</span>
                                                                                            </div>
                                                                                            <span className="text-sm font-medium text-gray-900">
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
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                                                                        <div className="flex justify-center mb-3">
                                                                            <div className="p-3 bg-blue-100 rounded-full">
                                                                                <Info size={24} className="text-blue-500" />
                                                                            </div>
                                                                        </div>
                                                                        <h3 className="text-gray-700 font-medium mb-1">No Transaction Limits Defined</h3>
                                                                        <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
                                                                            Add transaction limits to define what operations users with this KYC level can perform.
                                                                        </p>
                                                                        <button
                                                                            onClick={() => openAddLimitModal(config)}
                                                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm text-sm font-medium"
                                                                        >
                                                                            <Plus size={16} />
                                                                            <span>Add Your First Limit</span>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="mb-4 p-4 bg-gray-100 rounded-full">
                                            <Shield size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-gray-700 font-medium mb-2">No KYC Levels Found</h3>
                                        <p className="text-gray-500 text-sm max-w-md">
                                            There are no KYC levels matching your search criteria. Try adjusting your filters or create a new KYC level.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KycConfigList;