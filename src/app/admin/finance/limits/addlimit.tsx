import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { KycConfig, TransactionLimit, TransactionType } from '../../../../types/kyc';
import { formatTransactionType } from '../../../../utils/formatters';
import TransactionLimitForm from '../../../../components/kyc/TransactionLimitForm';
import kycService from '../../../../api/services/kyc';
import { toast } from 'react-hot-toast';

const DEFAULT_TRANSACTION_TYPES: TransactionType[] = ['send', 'WITHDRAW', 'withdraw_mpesa', 'transfer', 'gift'];

const AddTransactionLimitPage: React.FC = () => {
    const navigate = useNavigate();
    const { kycConfigId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [kycConfig, setKycConfig] = useState<KycConfig | null>(null);
    const [availableTransactionTypes, setAvailableTransactionTypes] = useState<TransactionType[]>([]);

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
        if (kycConfigId) {
            fetchKycConfig();
        }
    }, [kycConfigId]);

    const fetchKycConfig = async () => {
        setIsLoadingData(true);
        try {
            const config = await kycService.getKycConfigById(kycConfigId!);
            setKycConfig(config);

            const existingTypes = config.transactionLimits?.map(limit => limit.transactionType) || [];
            const available = DEFAULT_TRANSACTION_TYPES.filter(type => !existingTypes.includes(type));
            setAvailableTransactionTypes(available);
        } catch (error) {
            console.error('Failed to fetch KYC config:', error);
            toast.error('Failed to load KYC configuration');
            navigate('/admin/finance/limits');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async (formData: Omit<TransactionLimit, 'id' | 'kycConfigId'> & { transactionType?: TransactionType }) => {
        if (!kycConfig || !formData.transactionType) {
            toast.error('Please select a transaction type');
            return;
        }

        setIsLoading(true);

        try {
            await kycService.createTransactionLimit({
                kycConfigId: kycConfig.id!,
                ...formData,
                transactionType: formData.transactionType
            });

            toast.success('Transaction limit added successfully!', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });

            navigate('/admin/finance/limits');
        } catch (error) {
            console.error('Failed to add transaction limit:', error);
            toast.error('Failed to add transaction limit. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/finance/limits');
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading KYC configuration...</p>
                </div>
            </div>
        );
    }

    if (!kycConfig) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">KYC Configuration Not Found</h3>
                    <p className="text-gray-600 mb-6">The requested KYC configuration could not be loaded.</p>
                    <button
                        onClick={() => navigate('/admin/finance/limits')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Back to KYC Management
                    </button>
                </div>
            </div>
        );
    }

    if (availableTransactionTypes.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} className="text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Transaction Types Configured</h3>
                    <p className="text-gray-600 mb-6">This KYC level already has limits configured for all available transaction types.</p>
                    <button
                        onClick={() => navigate('/admin/finance/limits')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
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
                {/* KYC Config Info */}
                <motion.div
                    className="bg-indigo-50/70 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Save size={18} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-indigo-900 mb-1">Adding Transaction Limit</h3>
                            <p className="text-indigo-700 text-sm">
                                <span className="font-medium">KYC Level:</span> {kycConfig.name} ({kycConfig.level})
                            </p>
                            <p className="text-indigo-600 text-sm mt-1">
                                Configure transaction limits for an additional transaction type.
                            </p>
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
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Transaction Limit</h1>
                            <p className="text-gray-600">Configure limits for a new transaction type</p>
                        </div>

                        <TransactionLimitForm
                            isAdd={true}
                            initialData={limitsFormData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            availableTransactionTypes={availableTransactionTypes}
                        />
                    </div>
                </motion.div>

                {/* Info Card */}
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
                            <h3 className="font-semibold text-amber-900 mb-2">Transaction Limit Guidelines</h3>
                            <ul className="text-amber-700 text-sm space-y-1">
                                <li>• Set reasonable limits based on your KYC level requirements</li>
                                <li>• Higher KYC levels typically have higher transaction limits</li>
                                <li>• Consider your compliance and risk management policies</li>
                                <li>• Disabled transaction types will not be available to users</li>
                                <li>• Limits apply per user and reset based on the time period</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AddTransactionLimitPage;