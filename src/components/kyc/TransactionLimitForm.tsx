import React, { useState } from 'react';
import { formatTransactionType } from '../../utils/formatters';
import { TransactionLimit, TransactionType } from '../../types/kyc';
import {
    Calendar,
    DollarSign,
    ArrowUp,
    ArrowDown,
    AlertCircle,
    Check,
    PauseCircle
} from 'lucide-react';

interface TransactionLimitFormProps {
    transactionType?: TransactionType | null;
    initialData: Omit<TransactionLimit, 'id' | 'transactionType' | 'kycConfigId'>;
    onSubmit: (formData: Omit<TransactionLimit, 'id' | 'kycConfigId'> & { transactionType?: TransactionType }) => void;
    onCancel: () => void;
    isAdd?: boolean;
    availableTransactionTypes?: TransactionType[];
}

const TransactionLimitForm: React.FC<TransactionLimitFormProps> = ({
    transactionType,
    initialData,
    onSubmit,
    onCancel,
    isAdd = false,
    availableTransactionTypes = []
}) => {
    const [formData, setFormData] = useState<Omit<TransactionLimit, 'id' | 'kycConfigId'> & { transactionType?: TransactionType }>({
        ...initialData,
        transactionType: transactionType || undefined
    });

    const [activeSection, setActiveSection] = useState<string>('daily');

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'transactionType' ? value : parseFloat(value) || 0
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stylish Header with Transaction Type Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 -mx-6 -mt-6 mb-6 border-b border-blue-100">
                <div className="max-w-3xl mx-auto">
                    {isAdd ? (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Select Transaction Type
                            </h3>
                            <div className="relative">
                                <select
                                    id="transactionType"
                                    name="transactionType"
                                    value={formData.transactionType || ''}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full py-3 px-4 pr-10 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 text-sm shadow-sm transition-all duration-200 appearance-none"
                                >
                                    <option value="">Select a transaction type</option>
                                    {availableTransactionTypes.map(type => (
                                        <option key={type} value={type}>
                                            {getTransactionTypeIcon(type)} {formatTransactionType(type)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ArrowDown size={16} className="text-gray-500" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                This will determine which transaction operations this limit applies to
                            </p>
                        </div>
                    ) : (
                        <div className="mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{transactionType && getTransactionTypeIcon(transactionType)}</span>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {formatTransactionType(transactionType)}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Configure the limits for this transaction type
                            </p>
                        </div>
                    )}

                    {/* Global Enable/Disable Toggle with styled switch */}
                    <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div>
                            <h4 className="font-medium text-gray-800">Transaction Status</h4>
                            <p className="text-xs text-gray-500">Enable or disable this transaction type</p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAllowed"
                                checked={formData.isAllowed}
                                onChange={handleFormChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                {formData.isAllowed ? 'Enabled' : 'Disabled'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs for Limit Types */}
            <div className={`${!formData.isAllowed ? 'opacity-60 pointer-events-none' : ''} transition-opacity duration-200`}>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveSection('daily')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeSection === 'daily' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            <Calendar size={14} />
                            <span>Daily</span>
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('weekly')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeSection === 'weekly' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            <Calendar size={14} />
                            <span>Weekly</span>
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('monthly')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeSection === 'monthly' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            <Calendar size={14} />
                            <span>Monthly</span>
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('transaction')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${activeSection === 'transaction' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            <DollarSign size={14} />
                            <span>Per Transaction</span>
                        </span>
                    </button>
                </div>

                {/* Limit Sections */}
                <div className="transition-all duration-200">
                    {/* Daily Limit Section */}
                    <div className={`${activeSection === 'daily' ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Calendar size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Daily Transaction Limit</h3>
                                        <p className="text-xs text-gray-500">Maximum amount per day</p>
                                    </div>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isDailyLimitEnabled"
                                        checked={formData.isDailyLimitEnabled}
                                        onChange={handleFormChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>
                            </div>

                            {formData.isDailyLimitEnabled && (
                                <div className="p-4 bg-gray-50">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="dailyLimit"
                                            value={formData.dailyLimit}
                                            onChange={handleFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-3 pl-10 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 text-sm"
                                            placeholder="Enter daily limit amount"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500 font-medium">KES</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                                        <AlertCircle size={12} className="text-blue-500 mr-1" />
                                        This is the maximum total amount a user can transact in a single day
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Limit Section */}
                    <div className={`${activeSection === 'weekly' ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <Calendar size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Weekly Transaction Limit</h3>
                                        <p className="text-xs text-gray-500">Maximum amount per week</p>
                                    </div>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isWeeklyLimitEnabled"
                                        checked={formData.isWeeklyLimitEnabled}
                                        onChange={handleFormChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                            </div>

                            {formData.isWeeklyLimitEnabled && (
                                <div className="p-4 bg-gray-50">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="weeklyLimit"
                                            value={formData.weeklyLimit}
                                            onChange={handleFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-3 pl-10 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-800 text-sm"
                                            placeholder="Enter weekly limit amount"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500 font-medium">KES</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                                        <AlertCircle size={12} className="text-purple-500 mr-1" />
                                        This is the maximum total amount a user can transact in a rolling 7-day period
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Limit Section */}
                    <div className={`${activeSection === 'monthly' ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Calendar size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Monthly Transaction Limit</h3>
                                        <p className="text-xs text-gray-500">Maximum amount per month</p>
                                    </div>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isMonthlyLimitEnabled"
                                        checked={formData.isMonthlyLimitEnabled}
                                        onChange={handleFormChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            {formData.isMonthlyLimitEnabled && (
                                <div className="p-4 bg-gray-50">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="monthlyLimit"
                                            value={formData.monthlyLimit}
                                            onChange={handleFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-3 pl-10 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-800 text-sm"
                                            placeholder="Enter monthly limit amount"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500 font-medium">KES</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                                        <AlertCircle size={12} className="text-green-500 mr-1" />
                                        This is the maximum total amount a user can transact in a calendar month
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Per Transaction Limits Section */}
                    <div className={`${activeSection === 'transaction' ? 'block' : 'hidden'}`}>
                        <div className="space-y-4">
                            {/* Min Transaction Limit */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-lg">
                                            <ArrowDown size={20} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Minimum Transaction Amount</h3>
                                            <p className="text-xs text-gray-500">Smallest allowed transaction</p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isPerTransactionMinEnabled"
                                            checked={formData.isPerTransactionMinEnabled}
                                            onChange={handleFormChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                {formData.isPerTransactionMinEnabled && (
                                    <div className="p-4 bg-gray-50">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="perTransactionMin"
                                                value={formData.perTransactionMin}
                                                onChange={handleFormChange}
                                                min="0"
                                                step="1"
                                                required
                                                className="w-full py-3 pl-10 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-800 text-sm"
                                                placeholder="Enter minimum transaction amount"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-500 font-medium">KES</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                                            <AlertCircle size={12} className="text-amber-500 mr-1" />
                                            Transactions below this amount will be rejected
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Max Transaction Limit */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 p-2 rounded-lg">
                                            <ArrowUp size={20} className="text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Maximum Transaction Amount</h3>
                                            <p className="text-xs text-gray-500">Largest allowed transaction</p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isPerTransactionMaxEnabled"
                                            checked={formData.isPerTransactionMaxEnabled}
                                            onChange={handleFormChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                    </label>
                                </div>

                                {formData.isPerTransactionMaxEnabled && (
                                    <div className="p-4 bg-gray-50">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="perTransactionMax"
                                                value={formData.perTransactionMax}
                                                onChange={handleFormChange}
                                                min="0"
                                                step="1"
                                                required
                                                className="w-full py-3 pl-10 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-gray-800 text-sm"
                                                placeholder="Enter maximum transaction amount"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-500 font-medium">KES</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                                            <AlertCircle size={12} className="text-red-500 mr-1" />
                                            Transactions above this amount will be rejected
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons with enhanced styling */}
            <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
                    {!formData.isAllowed && (
                        <div className="mb-4 sm:mb-0 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                            <PauseCircle size={20} className="text-amber-500" />
                            <p className="text-xs text-amber-800">
                                This transaction type is currently disabled and will not be available for users
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:ml-auto">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            {isAdd ? 'Add Limit' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default TransactionLimitForm;