import React from 'react';
import { Loader } from 'lucide-react';

interface RangeFormProps {
    rangeFormData: any;
    setRangeFormData: any;
    isLoading: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

const RangeForm: React.FC<RangeFormProps> = ({
    rangeFormData,
    setRangeFormData,
    isLoading,
    onSubmit,
    onCancel
}) => {
    const handleRangeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'max' && (value === '' || value.toLowerCase() === 'null')) {
            setRangeFormData(prev => ({
                ...prev,
                max: null
            }));
            return;
        }

        setRangeFormData(prev => ({
            ...prev,
            [name]: name === 'fee' || name === 'min' || name === 'max' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <div>
                    <label htmlFor="min" className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum Amount (KES)
                    </label>
                    <input
                        type="number"
                        id="min"
                        name="min"
                        value={rangeFormData.min}
                        onChange={handleRangeFormChange}
                        min="0"
                        required
                        className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                        placeholder="e.g., 0"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">The minimum transaction amount for this range (inclusive)</p>
                </div>

                <div>
                    <label htmlFor="max" className="block text-xs font-medium text-gray-700 mb-1">
                        Maximum Amount (KES)
                    </label>
                    <input
                        type="text"
                        id="max"
                        name="max"
                        value={rangeFormData.max === null ? '' : rangeFormData.max}
                        onChange={handleRangeFormChange}
                        min="0"
                        className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                        placeholder="Leave empty for 'and above'"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">The maximum transaction amount for this range (inclusive). Leave empty for "and above".</p>
                </div>

                <div>
                    <label htmlFor="fee" className="block text-xs font-medium text-gray-700 mb-1">
                        Fee
                    </label>
                    <input
                        type="number"
                        id="fee"
                        name="fee"
                        value={rangeFormData.fee}
                        onChange={handleRangeFormChange}
                        min="0"
                        step="0.1"
                        required
                        className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-400 text-gray-800 text-sm"
                        placeholder="e.g., 50"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">The fee to charge for transactions in this range (KES for flat fees, % for percentage fees)</p>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm flex items-center gap-1.5"
                    disabled={isLoading}
                >
                    {isLoading && <Loader size={14} className="animate-spin" />}
                    Save Range
                </button>
            </div>
        </div>
    );
};

export default RangeForm;