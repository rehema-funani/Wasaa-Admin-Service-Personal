import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { KycConfig, KycLevel, TransactionType } from '../../../../types/kyc';
import RequirementsInput from '../../../../components/kyc/RequirementsInput';
import kycService from '../../../../api/services/kyc';
import { toast } from 'react-hot-toast';

const DEFAULT_TRANSACTION_TYPES: TransactionType[] = ['send', 'WITHDRAW', 'withdraw_mpesa', 'transfer', 'gift'];

const AddKycConfigPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>>({
        level: 'basic',
        name: '',
        description: '',
        requirements: [],
        status: 'active'
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormLevelChange = (level: KycLevel) => {
        setFormData(prev => ({
            ...prev,
            level
        }));
    };

    const handleRequirementsChange = (requirements: string[]) => {
        setFormData(prev => ({
            ...prev,
            requirements
        }));
    };

    const handleFormStatusChange = (status: 'active' | 'inactive') => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Please enter a KYC level name');
            return;
        }

        setIsLoading(true);

        try {
            let requirementsArray: string[] = [];
            if (typeof formData.requirements === 'string') {
                requirementsArray = (formData.requirements as unknown as string)
                    .split('\n')
                    .map(req => req.trim())
                    .filter(req => req.length > 0);
            } else {
                requirementsArray = formData.requirements;
            }

            const configData = {
                ...formData,
                requirements: requirementsArray
            };

            await kycService.createKycConfig(configData);

            navigate(-1);
        } catch (error) {
            console.error('Failed to create KYC config:', error);
            toast.error('Failed to create KYC level. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                onClick={() => navigate(-1)}
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
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <motion.button
                                type="submit"
                                form="kyc-config-form"
                                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                ) : (
                                    <Save size={16} className="mr-2" />
                                )}
                                {isLoading ? 'Creating...' : 'Create KYC Level'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6">
                <motion.div
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New KYC Level</h1>
                            <p className="text-gray-600">Configure a new KYC verification level with requirements and default transaction limits</p>
                        </div>

                        <form id="kyc-config-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        KYC Level Type
                                    </label>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                        <button
                                            type="button"
                                            onClick={() => handleFormLevelChange('basic')}
                                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.level === 'basic'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            disabled={isLoading}
                                        >
                                            <User size={16} className="mr-2" />
                                            Basic
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleFormLevelChange('standard')}
                                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.level === 'standard'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            disabled={isLoading}
                                        >
                                            <Shield size={16} className="mr-2" />
                                            Standard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleFormLevelChange('advanced')}
                                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.level === 'advanced'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            disabled={isLoading}
                                        >
                                            <Shield size={16} className="mr-2" />
                                            Advanced
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Level Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                                            placeholder="e.g., Basic Verification"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                            <button
                                                type="button"
                                                onClick={() => handleFormStatusChange('active')}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${formData.status === 'active'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                disabled={isLoading}
                                            >
                                                Active
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleFormStatusChange('inactive')}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${formData.status === 'inactive'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                disabled={isLoading}
                                            >
                                                Inactive
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all resize-none"
                                        placeholder="Describe the purpose and scope of this KYC level..."
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Requirements
                                    </label>
                                    <RequirementsInput
                                        value={formData.requirements}
                                        onChange={handleRequirementsChange}
                                        disabled={isLoading}
                                        placeholder="Type a verification requirement and press Enter..."
                                    />
                                    <p className="text-sm text-gray-500 mt-2">Add requirements that users need to complete for this KYC level. Use the Quick Add button for common requirements.</p>
                                </div>
                            </div>

                            {/* Default Limits Info */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">Default Transaction Limits</h2>

                                <div className="bg-primary-50/70 backdrop-blur-sm rounded-2xl p-6 border border-primary-100">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <CheckCircle size={18} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-primary-900 mb-2">Automatic Setup</h3>
                                            <p className="text-primary-700 text-sm leading-relaxed mb-3">
                                                Default transaction limits will be automatically created for all transaction types:
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-primary-600">
                                                <div>
                                                    <p className="font-medium">Daily Limit: KES 5,000</p>
                                                    <p className="font-medium">Weekly Limit: KES 15,000</p>
                                                    <p className="font-medium">Monthly Limit: KES 50,000</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Min per Transaction: KES 100</p>
                                                    <p className="font-medium">Max per Transaction: KES 5,000</p>
                                                    <p className="font-medium">All transaction types enabled</p>
                                                </div>
                                            </div>
                                            <p className="text-primary-700 text-sm mt-3">
                                                You can customize these limits later for each transaction type individually.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-6 bg-amber-50/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Shield size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-900 mb-2">KYC Level Guidelines</h3>
                            <ul className="text-amber-700 text-sm space-y-1">
                                <li>• <strong>Basic:</strong> Minimal verification for low-value transactions</li>
                                <li>• <strong>Standard:</strong> Moderate verification for regular transactions</li>
                                <li>• <strong>Advanced:</strong> Full verification for high-value transactions</li>
                                <li>• Requirements should be clear and achievable for your target users</li>
                                <li>• Transaction limits can be customized after creation</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AddKycConfigPage;