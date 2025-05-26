import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Percent,
    DollarSign,
    Plus,
    X,
    Save,
    AlertTriangle,
    Info
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';

interface Range {
    id: string;
    min: number;
    max: number | null;
    fee: number;
}

interface FormData {
    name: string;
    description: string;
    type: 'flat' | 'percentage';
    value: number;
    fixedRanges: Range[];
    percentageRanges: Range[];
    status: 'active' | 'inactive';
}

const AddTariffPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        type: 'flat',
        value: 0,
        fixedRanges: [{ id: 'new-1', min: 0, max: null, fee: 0 }],
        percentageRanges: [],
        status: 'active'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'value' ? parseFloat(value) || 0 : value
        }));
    };

    const handleTypeChange = (type: 'flat' | 'percentage') => {
        setFormData(prev => ({
            ...prev,
            type,
            ...(type === 'flat' && prev.fixedRanges.length === 0 && {
                fixedRanges: [{ id: 'new-1', min: 0, max: null, fee: 0 }]
            }),
            ...(type === 'percentage' && prev.percentageRanges.length === 0 && {
                percentageRanges: [{ id: 'new-1', min: 0, max: null, fee: 0 }]
            })
        }));
    };

    const handleStatusChange = (status: 'active' | 'inactive') => {
        setFormData(prev => ({ ...prev, status }));
    };

    const addRange = (rangeType: 'fixed' | 'percentage') => {
        const ranges = rangeType === 'fixed' ? formData.fixedRanges : formData.percentageRanges;
        const tempId = `new-${ranges.length + 1}`;

        const highestRange = [...ranges].sort((a, b) => (b.max || Infinity) - (a.max || Infinity))[0];
        const suggestedMin = highestRange && highestRange.max !== null ? highestRange.max + 1 : 0;

        const newRange = { id: tempId, min: suggestedMin, max: null, fee: 0 };

        if (rangeType === 'fixed') {
            setFormData(prev => ({
                ...prev,
                fixedRanges: [...prev.fixedRanges, newRange].sort((a, b) => a.min - b.min)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                percentageRanges: [...prev.percentageRanges, newRange].sort((a, b) => a.min - b.min)
            }));
        }
    };

    const removeRange = (id: string, rangeType: 'fixed' | 'percentage') => {
        const ranges = rangeType === 'fixed' ? formData.fixedRanges : formData.percentageRanges;

        if (ranges.length === 1) {
            toast.error(`Cannot delete the last ${rangeType} range`);
            return;
        }

        if (rangeType === 'fixed') {
            setFormData(prev => ({
                ...prev,
                fixedRanges: prev.fixedRanges.filter(range => range.id !== id)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                percentageRanges: prev.percentageRanges.filter(range => range.id !== id)
            }));
        }
    };

    const updateRange = (id: string, field: keyof Range, value: any, rangeType: 'fixed' | 'percentage') => {
        if (field === 'max' && (value === '' || value === 'null')) {
            if (rangeType === 'fixed') {
                setFormData(prev => ({
                    ...prev,
                    fixedRanges: prev.fixedRanges.map(range =>
                        range.id === id ? { ...range, max: null } : range
                    )
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    percentageRanges: prev.percentageRanges.map(range =>
                        range.id === id ? { ...range, max: null } : range
                    )
                }));
            }
            return;
        }

        if (rangeType === 'fixed') {
            setFormData(prev => ({
                ...prev,
                fixedRanges: prev.fixedRanges.map(range =>
                    range.id === id
                        ? { ...range, [field]: field === 'min' || field === 'max' || field === 'fee' ? parseFloat(value) || 0 : value }
                        : range
                ).sort((a, b) => a.min - b.min)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                percentageRanges: prev.percentageRanges.map(range =>
                    range.id === id
                        ? { ...range, [field]: field === 'min' || field === 'max' || field === 'fee' ? parseFloat(value) || 0 : value }
                        : range
                ).sort((a, b) => a.min - b.min)
            }));
        }
    };

    const validateRanges = (ranges: Range[]) => {
        for (const range of ranges) {
            if (range.min < 0) {
                toast.error('Minimum value cannot be negative');
                return false;
            }

            if (range.max !== null && range.max <= range.min) {
                toast.error('Maximum value must be greater than minimum value');
                return false;
            }
        }

        // Check for overlaps
        for (let i = 0; i < ranges.length; i++) {
            for (let j = i + 1; j < ranges.length; j++) {
                const range1 = ranges[i];
                const range2 = ranges[j];

                const range1Max = range1.max === null ? Infinity : range1.max;
                const range2Max = range2.max === null ? Infinity : range2.max;

                if (range1.min <= range2Max && range2.min <= range1Max) {
                    toast.error('Ranges cannot overlap');
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Please enter a tariff name');
            return;
        }

        if (formData.type === 'flat' && !validateRanges(formData.fixedRanges)) {
            return;
        }

        if (formData.type === 'percentage' && !validateRanges(formData.percentageRanges)) {
            return;
        }

        setIsLoading(true);

        try {
            const tariffToCreate = {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                status: formData.status,
                ...(formData.type === 'percentage' && { value: formData.value })
            };

            const createdTariff = await financeService.createTariff(tariffToCreate);

            // Create ranges
            if (formData.type === 'flat') {
                await Promise.all(
                    formData.fixedRanges.map(range =>
                        financeService.createFixedRange({
                            walletBillingId: createdTariff.id,
                            min: range.min,
                            max: range.max,
                            fee: range.fee,
                            type: 'fixed'
                        })
                    )
                );
            } else {
                await Promise.all(
                    formData.percentageRanges.map(range =>
                        financeService.createPercentageFeeRange({
                            walletBillingId: createdTariff.id,
                            min: range.min,
                            max: range.max,
                            fee: range.fee,
                            type: 'percentage'
                        })
                    )
                );
            }

            toast.success('Tariff created successfully!', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });

            navigate('/admin/finance/tariffs');
        } catch (err) {
            toast.error('Failed to create tariff');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/finance/tariffs')}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                <span className="font-medium">Back to Tariffs</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/finance/tariffs')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <motion.button
                                type="submit"
                                form="tariff-form"
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
                                {isLoading ? 'Creating...' : 'Create Tariff'}
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
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Tariff</h1>
                            <p className="text-gray-600">Set up pricing rules for transaction fees</p>
                        </div>

                        <form id="tariff-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tariff Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                                            placeholder="e.g., Send Money Fee"
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
                                                onClick={() => handleStatusChange('active')}
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
                                                onClick={() => handleStatusChange('inactive')}
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
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all resize-none"
                                        placeholder="Describe the purpose of this tariff..."
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Fee Type */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Fee Structure</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Fee Type
                                    </label>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange('flat')}
                                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.type === 'flat'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            disabled={isLoading}
                                        >
                                            <DollarSign size={16} className="mr-2" />
                                            Fixed Rate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange('percentage')}
                                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all ${formData.type === 'percentage'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            disabled={isLoading}
                                        >
                                            <Percent size={16} className="mr-2" />
                                            Percentage
                                        </button>
                                    </div>
                                </div>

                                {formData.type === 'percentage' && (
                                    <div>
                                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                                            Base Percentage (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                id="value"
                                                name="value"
                                                value={formData.value}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.1"
                                                className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                                                disabled={isLoading}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <Percent size={16} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ranges */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {formData.type === 'flat' ? 'Fixed Fee Ranges' : 'Percentage Fee Ranges'}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => addRange(formData.type === 'flat' ? 'fixed' : 'percentage')}
                                        className="flex items-center px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all text-sm font-medium"
                                        disabled={isLoading}
                                    >
                                        <Plus size={16} className="mr-2" />
                                        Add Range
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(formData.type === 'flat' ? formData.fixedRanges : formData.percentageRanges).map((range, index) => (
                                        <motion.div
                                            key={range.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-medium text-gray-900">Range {index + 1}</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRange(range.id, formData.type === 'flat' ? 'fixed' : 'percentage')}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    disabled={isLoading || (formData.type === 'flat' ? formData.fixedRanges.length : formData.percentageRanges.length) === 1}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Minimum (KES)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={range.min}
                                                        onChange={(e) => updateRange(range.id, 'min', e.target.value, formData.type === 'flat' ? 'fixed' : 'percentage')}
                                                        min="0"
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 text-gray-900"
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Maximum (KES)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={range.max === null ? '' : range.max}
                                                        onChange={(e) => updateRange(range.id, 'max', e.target.value, formData.type === 'flat' ? 'fixed' : 'percentage')}
                                                        placeholder="Leave empty for 'and above'"
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 text-gray-900"
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Fee ({formData.type === 'flat' ? 'KES' : '%'})
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={range.fee}
                                                        onChange={(e) => updateRange(range.id, 'fee', e.target.value, formData.type === 'flat' ? 'fixed' : 'percentage')}
                                                        min="0"
                                                        step="0.1"
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 text-gray-900"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    className="mt-6 bg-primary-50/70 backdrop-blur-sm rounded-2xl p-6 border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Info size={18} className="text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary-900 mb-2">Tips for Creating Tariffs</h3>
                            <ul className="text-primary-700 text-sm space-y-1">
                                <li>• Ensure ranges don't overlap to avoid conflicts</li>
                                <li>• Leave maximum empty for "and above" ranges</li>
                                <li>• Fixed rates charge specific amounts, percentages are calculated from transaction value</li>
                                <li>• Changes take effect immediately for new transactions</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AddTariffPage;