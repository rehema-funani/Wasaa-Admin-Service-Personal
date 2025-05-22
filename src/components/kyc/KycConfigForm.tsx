import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import { KycConfig, KycLevel } from '../../types/kyc';
import RequirementsInput from './RequirementsInput';

interface KycConfigFormProps {
    initialData: Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>;
    onSubmit: (formData: Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>) => void;
    onCancel: () => void;
    isAdd: boolean;
}

const KycConfigForm: React.FC<KycConfigFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isAdd
}) => {
    const [formData, setFormData] = useState<Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>>(initialData);

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

    const handleFormStatusChange = (status: 'active' | 'inactive') => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    const handleRequirementsChange = (requirements: string[]) => {
        setFormData(prev => ({
            ...prev,
            requirements
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                {/* KYC Level Selection */}
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
                        >
                            <Shield size={16} className="mr-2" />
                            Advanced
                        </button>
                    </div>
                </div>

                {/* Name and Status */}
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
                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:bg-white text-gray-900 transition-all"
                            placeholder="e.g., Basic Verification"
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
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description */}
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
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:bg-white text-gray-900 transition-all resize-none"
                        placeholder="Describe the purpose and scope of this KYC level..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Requirements
                    </label>
                    <RequirementsInput
                        value={formData.requirements}
                        onChange={handleRequirementsChange}
                        placeholder="Type a verification requirement and press Enter..."
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
                >
                    {isAdd ? 'Create KYC Level' : 'Update KYC Level'}
                </button>
            </div>
        </form>
    );
};

export default KycConfigForm;