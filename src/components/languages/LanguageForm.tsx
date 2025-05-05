import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, ArrowLeftRight } from 'lucide-react';
import { Language, LanguageFormData } from '../../types/language';
import countryCodes from '../../data/countryCodes';

interface LanguageFormProps {
    initialData?: Language;
    onSubmit: (language: LanguageFormData) => void;
    onCancel: () => void;
}

const LanguageForm: React.FC<LanguageFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<LanguageFormData>({
        name: '',
        code: '',
        country: '',
        is_active: true,
        is_default: false,
        is_rtl: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                country: initialData.country,
                is_active: initialData.is_active,
                is_default: initialData.is_default,
                is_rtl: initialData.is_rtl
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleToggle = (field: keyof LanguageFormData) => {
        setFormData({
            ...formData,
            [field]: !formData[field]
        });
    };

    const handleCountrySelect = (code: string, name: string) => {
        setFormData({
            ...formData,
            country: name
        });
        setShowCountryDropdown(false);
        setCountrySearch('');
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Language name is required';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Language code is required';
        } else if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(formData.code)) {
            newErrors.code = 'Invalid format. Use format: en or en-US';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const filteredCountries = countrySearch.trim() === ''
        ? countryCodes
        : countryCodes.filter(country =>
            country.name.toLowerCase().includes(countrySearch.toLowerCase())
        );

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            } focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors`}
                        placeholder="English"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language Code
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-xl border ${errors.code ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                } focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors`}
                            placeholder="en or en-US"
                        />
                        <Globe size={18} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    {errors.code ? (
                        <p className="mt-1 text-xs text-red-500">{errors.code}</p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-500">
                            Use format: en (language) or en-US (language-COUNTRY)
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="country"
                            value={countrySearch || formData.country}
                            onChange={(e) => {
                                setCountrySearch(e.target.value);
                                setShowCountryDropdown(true);
                                if (errors.country) {
                                    setErrors({
                                        ...errors,
                                        country: ''
                                    });
                                }
                            }}
                            onFocus={() => setShowCountryDropdown(true)}
                            className={`w-full px-3 py-2 rounded-xl border ${errors.country ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                } focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors`}
                            placeholder="United States"
                        />
                        {errors.country && (
                            <p className="mt-1 text-xs text-red-500">{errors.country}</p>
                        )}

                        {showCountryDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                                {filteredCountries.length === 0 ? (
                                    <div className="p-3 text-sm text-gray-500 text-center">
                                        No countries found
                                    </div>
                                ) : (
                                    <ul className="py-1">
                                        {filteredCountries.map((country) => (
                                            <li
                                                key={country.code}
                                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                                                onClick={() => handleCountrySelect(country.code, country.name)}
                                            >
                                                {country.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2">Right-to-Left</span>
                            <ArrowLeftRight size={16} className="text-gray-400" />
                        </div>
                        <motion.button
                            type="button"
                            onClick={() => handleToggle('is_rtl')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${formData.is_rtl ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.is_rtl ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </motion.button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Active Status</span>
                        <motion.button
                            type="button"
                            onClick={() => handleToggle('is_active')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${formData.is_active ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </motion.button>
                    </div>

                    {!initialData?.is_default && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Set as Default</span>
                            <motion.button
                                type="button"
                                onClick={() => handleToggle('is_default')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${formData.is_default ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.is_default ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Cancel
                </motion.button>
                <motion.button
                    type="submit"
                    className="flex items-center px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Save size={16} className="mr-1" />
                    Save
                </motion.button>
            </div>
        </form>
    );
};

export default LanguageForm;