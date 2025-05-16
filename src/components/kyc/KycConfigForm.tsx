import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import { KycConfig, KycLevel } from '../../types/kyc';


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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format requirements as an array
        let requirementsArray: string[] = [];

        if (typeof formData.requirements === 'string') {
            requirementsArray = (formData.requirements as unknown as string)
                .split('\n')
                .map(req => req.trim())
                .filter(req => req.length > 0);
        } else {
            requirementsArray = formData.requirements;
        }

        onSubmit({
            ...formData,
            requirements: requirementsArray
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        KYC Level
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                        <button
                            type="button"
                            onClick={() => handleFormLevelChange('basic')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.level === 'basic'
                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                : 'text-gray-500'
                                }`}
                        >
                            <User size={12} />
                            <span>Basic</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormLevelChange('standard')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.level === 'standard'
                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                : 'text-gray-500'
                                }`}
                        >
                            <Shield size={12} />
                            <span>Standard</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormLevelChange('advanced')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.level === 'advanced'
                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                : 'text-gray-500'
                                }`}
                        >
                            <Shield size={12} />
                            <span>Advanced</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                        Level Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                        placeholder="e.g., Basic Verification"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows={2}
                        className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                        placeholder="Describe the KYC level"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="requirements" className="block text-xs font-medium text-gray-700 mb-1">
                        Requirements (one per line)
                    </label>
                    <textarea
                        id="requirements"
                        name="requirements"
                        value={Array.isArray(formData.requirements) ? formData.requirements.join('\n') : formData.requirements}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                        placeholder="Email verification
Phone number verification
National ID card
Proof of address"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Enter each requirement on a new line.</p>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                        <button
                            type="button"
                            onClick={() => handleFormStatusChange('active')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'active'
                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                : 'text-gray-500'
                                }`}
                        >
                            <span>Active</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFormStatusChange('inactive')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'inactive'
                                ? 'bg-white shadow-sm text-gray-800 font-medium'
                                : 'text-gray-500'
                                }`}
                        >
                            <span>Inactive</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                    {isAdd ? 'Add KYC Level' : 'Update KYC Level'}
                </button>
            </div>
        </form>
    );
};

export default KycConfigForm;