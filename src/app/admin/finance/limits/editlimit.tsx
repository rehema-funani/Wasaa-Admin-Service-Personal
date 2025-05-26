import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { KycConfig, TransactionLimit, TransactionType } from '../../../../types/kyc';
import { formatTransactionType } from '../../../../utils/formatters';
import TransactionLimitForm from '../../../../components/kyc/TransactionLimitForm';
import kycService from '../../../../api/services/kyc';
import { toast } from 'react-hot-toast';

const EditTransactionLimitPage: React.FC = () => {
    const navigate = useNavigate();
    const { kycConfigId, transactionType } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [kycConfig, setKycConfig] = useState<KycConfig | null>(null);
    const [currentLimit, setCurrentLimit] = useState<TransactionLimit | null>(null);

    const [limitsFormData, setLimitsFormData] = useState<Omit<TransactionLimit, 'id' | 'transactionType' | 'kycConfigId'>>({
        isDailyLimitEnabled: true,
        dailyLimit: 5000,
        isWeeklyLimitEnabled: true,
        weeklyLimit: 15000,
        isMonthlyLimitEnabled: true,
        monthlyLimit: 50000,
        isPerTransactionMinEnabled: true,
        perTransactionMin: 100,
        isPerTransactionMaxEnabled: true,
        perTransactionMax: 5000,
        isAllowed: true
    });

    useEffect(() => {
        if (kycConfigId && transactionType) {
            fetchKycConfigAndLimit();
        }
    }, [kycConfigId, transactionType]);

    const fetchKycConfigAndLimit = async () => {
        setIsLoadingData(true);
        try {
            const config = await kycService.getKycConfigById(kycConfigId!);
            setKycConfig(config);

            // Find the specific transaction limit
            const limit = config.transactionLimits?.find(
                limit => limit.transactionType === transactionType as TransactionType
            );

            if (limit) {
                setCurrentLimit(limit);
                setLimitsFormData({
                    isDailyLimitEnabled: limit.isDailyLimitEnabled,
                    dailyLimit: limit.dailyLimit,
                    isWeeklyLimitEnabled: limit.isWeeklyLimitEnabled,
                    weeklyLimit: limit.weeklyLimit,
                    isMonthlyLimitEnabled: limit.isMonthlyLimitEnabled,
                    monthlyLimit: limit.monthlyLimit,
                    isPerTransactionMinEnabled: limit.isPerTransactionMinEnabled,
                    perTransactionMin: limit.perTransactionMin,
                    isPerTransactionMaxEnabled: limit.isPerTransactionMaxEnabled,
                    perTransactionMax: limit.perTransactionMax,
                    isAllowed: limit.isAllowed
                });
            } else {
                toast.error('Transaction limit not found');
                navigate('/admin/finance/limits');
            }
        } catch (error) {
            console.error('Failed to fetch KYC config:', error);
            toast.error('Failed to load transaction limit');
            navigate('/admin/finance/limits');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async (formData: Omit<TransactionLimit, 'id' | 'kycConfigId'> & { transactionType?: TransactionType }) => {
        if (!kycConfig || !transactionType) {
            return;
        }

        setIsLoading(true);

        try {
            await kycService.updateTransactionLimit(
                kycConfig.id!,
                transactionType as TransactionType,
                {
                    isDailyLimitEnabled: formData.isDailyLimitEnabled,
                    dailyLimit: formData.dailyLimit,
                    isWeeklyLimitEnabled: formData.isWeeklyLimitEnabled,
                    weeklyLimit: formData.weeklyLimit,
                    isMonthlyLimitEnabled: formData.isMonthlyLimitEnabled,
                    monthlyLimit: formData.monthlyLimit,
                    isPerTransactionMinEnabled: formData.isPerTransactionMinEnabled,
                    perTransactionMin: formData.perTransactionMin,
                    isPerTransactionMaxEnabled: formData.isPerTransactionMaxEnabled,
                    perTransactionMax: formData.perTransactionMax,
                    isAllowed: formData.isAllowed
                }
            );

            toast.success('Transaction limit updated successfully!', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });

            navigate('/admin/finance/limits');
        } catch (error) {
            console.error('Failed to update transaction limit:', error);
            toast.error('Failed to update transaction limit. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/finance/limits');
    };

    const getTransactionTypeIcon = (type: TransactionType) => {
        switch (type) {
            case 'send': return '💸';
            case 'WITHDRAW': return '🏦';
            case 'withdraw_mpesa': return '📱';
            case 'transfer': return '↔️';
            case 'gift': return '🎁';
            default: return '💰';
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transaction limit...</p>
                </div>
            </div>
        );
    }

    if (!kycConfig || !currentLimit) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Limit Not Found</h3>
                    <p className="text-gray-600 mb-6">The requested transaction limit could not be loaded.</p>
                    <button
                        onClick={() => navigate('/admin/finance/limits')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                    >
                        Back to KYC Management
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                onClick={() => navigate('/admin/finance/limits')}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                <span className="font-medium">Back to KYC Management</span>
                            </motion.button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/finance/limits')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6">
                {/* KYC Config and Transaction Type Info */}
                <motion.div
                    className="bg-gradient-to-r from-primary-50 to-primary-50 backdrop-blur-sm rounded-2xl p-6 border border-primary-100 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl">
                                {getTransactionTypeIcon(transactionType as TransactionType)}
                            </div>
                            <div>
                                <h3 className="font-bold text-primary-900 text-lg">
                                    {formatTransactionType(transactionType as TransactionType)}
                                </h3>
                                <p className="text-primary-700 text-sm">
                                    <span className="font-medium">KYC Level:</span> {kycConfig.name} ({kycConfig.level})
                                </p>
                                <p className="text-primary-600 text-sm">
                                    Editing transaction limits for this transaction type
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentLimit.isAllowed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {currentLimit.isAllowed ? 'Enabled' : 'Disabled'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Transaction Limit</h1>
                            <p className="text-gray-600">Update the limits and settings for this transaction type</p>
                        </div>

                        <TransactionLimitForm
                            transactionType={transactionType as TransactionType}
                            initialData={limitsFormData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isAdd={false}
                        />
                    </div>
                </motion.div>

                {/* Warning Card */}
                <motion.div
                    className="mt-6 bg-amber-50/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-900 mb-2">Important Notes</h3>
                            <ul className="text-amber-700 text-sm space-y-1">
                                <li>• Changes will take effect immediately for all users with this KYC level</li>
                                <li>• Reducing limits may restrict users who are currently within the old limits</li>
                                <li>• Disabling this transaction type will prevent all related transactions</li>
                                <li>• Users will see the new limits in their transaction interface</li>
                                <li>• Consider notifying users of significant limit changes</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EditTransactionLimitPage;