import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Percent,
  DollarSign,
  Save,
  Info,
  User,
  Shield,
  Tag,
  Activity
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';

const OPERATIONS = ['WITHDRAW', 'DEPOSIT', 'TRANSFER', 'PAYMENT'];
const TIERS = ['standard', 'premium', 'business', 'enterprise'];
const KYC_LEVELS = ['basic', 'verified', 'enhanced', 'business'];
const APPLIED_TO = ['sender', 'receiver', 'both'];

const AddFeeRulePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    operation: 'WITHDRAW',
    flat_fee: '0',
    percent_fee: '0',
    min_amount: '0',
    max_amount: '',
    is_active: true,
    tier: 'standard',
    kyc_level: 'basic',
    applied_to: 'sender'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name === 'max_amount' && value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }));
    } else if (['flat_fee', 'percent_fee', 'min_amount', 'max_amount'].includes(name)) {
      const numValue = value === '' ? '' : parseFloat(value).toString();
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStatusChange = (status: boolean) => {
    setFormData(prev => ({ ...prev, is_active: status }));
  };

  const validateForm = (): boolean => {
    if (!formData.operation) {
      toast.error('Please select an operation');
      return false;
    }

    if (parseFloat(formData.min_amount) < 0) {
      toast.error('Minimum amount cannot be negative');
      return false;
    }

    if (formData.max_amount && parseFloat(formData.max_amount) <= parseFloat(formData.min_amount)) {
      toast.error('Maximum amount must be greater than minimum amount');
      return false;
    }

    if (parseFloat(formData.flat_fee) < 0) {
      toast.error('Flat fee cannot be negative');
      return false;
    }

    if (parseFloat(formData.percent_fee) < 0) {
      toast.error('Percentage fee cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const feeRuleData = {
        operation: formData.operation,
        flat_fee: parseFloat(formData.flat_fee || '0'),
        percent_fee: parseFloat(formData.percent_fee || '0'),
        min_amount: parseFloat(formData.min_amount || '0'),
        max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null,
        is_active: formData.is_active,
        tier: formData.tier,
        kyc_level: formData.kyc_level,
        applied_to: formData.applied_to
      };

      await financeService.createFeeRule(feeRuleData);

      toast.success('Fee rule created successfully!', {
        style: {
          background: '#10B981',
          color: 'white',
          borderRadius: '12px'
        }
      });

      navigate('/admin/finance/fee-rules');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create fee rule');
    } finally {
      setIsLoading(false);
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'WITHDRAW':
        return <Activity size={18} className="text-amber-600" />;
      case 'DEPOSIT':
        return <DollarSign size={18} className="text-emerald-600" />;
      case 'TRANSFER':
        return <User size={18} className="text-primary-600" />;
      default:
        return <Tag size={18} className="text-gray-600" />;
    }
  };

  const getOperationBackground = (operation: string) => {
    switch (operation) {
      case 'WITHDRAW':
        return 'bg-amber-100';
      case 'DEPOSIT':
        return 'bg-emerald-100';
      case 'TRANSFER':
        return 'bg-primary-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/finance/fee-rules')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-medium">Back to Fee Rules</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/finance/fee-rules')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                form="fee-rule-form"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 dark:bg-primary-900 dark:hover:bg-primary-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {isLoading ? 'Creating...' : 'Create Fee Rule'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create New Fee Rule</h1>
              <p className="text-gray-600 dark:text-gray-400">Set up pricing rules for transaction fees</p>
            </div>

            <form id="fee-rule-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Configuration */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Configuration</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-3">
                    Operation Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {OPERATIONS.map(operation => (
                      <button
                        key={operation}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, operation }))}
                        className={`flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${formData.operation === operation
                            ? 'bg-white border-2 border-primary-200 text-gray-900 shadow-sm dark:bg-gray-700 dark:border-primary-600 dark:text-white'
                            : 'bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        disabled={isLoading}
                      >
                        <div className={`w-8 h-8 ${getOperationBackground(operation)} rounded-lg flex items-center justify-center mr-2`}>
                          {getOperationIcon(operation)}
                        </div>
                        {operation}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Status
                  </label>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(true)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${formData.is_active
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      disabled={isLoading}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(false)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${!formData.is_active
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      disabled={isLoading}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount Range */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Amount Range</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      Minimum Amount (KES) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="min_amount"
                        name="min_amount"
                        value={formData.min_amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <DollarSign size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Amount (KES)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="max_amount"
                        name="max_amount"
                        value={formData.max_amount}
                        onChange={handleInputChange}
                        placeholder="Leave empty for unlimited"
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <DollarSign size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Configuration */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fee Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="flat_fee" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      Flat Fee (KES)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="flat_fee"
                        name="flat_fee"
                        value={formData.flat_fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <DollarSign size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="percent_fee" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      Percentage Fee (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="percent_fee"
                        name="percent_fee"
                        value={formData.percent_fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Percent size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <Info size={18} className="text-gray-500 dark:text-gray-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Fee Calculation Preview</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                    For a transaction of <span className="font-medium">KES 1,000</span>, the fee would be:
                    <span className="block mt-2 font-medium">
                      {parseFloat(formData.flat_fee || '0').toFixed(2)} KES +
                      {parseFloat(formData.percent_fee || '0').toFixed(2)}% =
                      {(
                        parseFloat(formData.flat_fee || '0') +
                        (1000 * parseFloat(formData.percent_fee || '0') / 100)
                      ).toFixed(2)} KES
                    </span>
                  </p>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Application Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="tier" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      User Tier
                    </label>
                    <div className="relative">
                      <select
                        id="tier"
                        name="tier"
                        value={formData.tier}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      >
                        {TIERS.map(tier => (
                          <option key={tier} value={tier}>
                            {tier.charAt(0).toUpperCase() + tier.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Tag size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="kyc_level" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      KYC Level
                    </label>
                    <div className="relative">
                      <select
                        id="kyc_level"
                        name="kyc_level"
                        value={formData.kyc_level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      >
                        {KYC_LEVELS.map(level => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Shield size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="applied_to" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      Applied To
                    </label>
                    <div className="relative">
                      <select
                        id="applied_to"
                        name="applied_to"
                        value={formData.applied_to}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary-600 dark:focus:bg-gray-800"
                        disabled={isLoading}
                      >
                        {APPLIED_TO.map(target => (
                          <option key={target} value={target}>
                            {target.charAt(0).toUpperCase() + target.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <User size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-6 bg-primary-50/70 dark:bg-primary-700 backdrop-blur-sm rounded-2xl p-6 border border-primary-100 dark:border-primary-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-700 rounded-xl flex items-center justify-center">
              <Info size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-primary-400 mb-2">About Fee Rules</h3>
              <ul className="text-primary-700 text-sm space-y-1 dark:text-primary-300">
                <li>• Each rule applies to a specific operation type, amount range, user tier, and KYC level</li>
                <li>• Fee calculation combines both flat and percentage components</li>
                <li>• Leave maximum amount empty for "unlimited" upper bound</li>
                <li>• The "Applied To" setting determines which party pays the fee</li>
                <li>• Changes take effect immediately for new transactions</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFeeRulePage;
