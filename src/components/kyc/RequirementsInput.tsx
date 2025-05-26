import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Check, FileText, Phone, Mail, CreditCard, MapPin, User, Shield, Camera, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RequirementsInputProps {
    value: string[];
    onChange: (requirements: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
}

const PREDEFINED_REQUIREMENTS = [
    { id: 'email', label: 'Email verification', icon: Mail },
    { id: 'phone', label: 'Phone number verification', icon: Phone },
    { id: 'national_id', label: 'National ID card', icon: CreditCard },
    { id: 'address', label: 'Proof of address', icon: MapPin },
    { id: 'photo_id', label: 'Government-issued photo ID', icon: User },
    { id: 'selfie', label: 'Selfie verification', icon: Camera },
    { id: 'income', label: 'Proof of income', icon: FileText },
    { id: 'bank_statement', label: 'Bank statement', icon: Building },
    { id: 'utility_bill', label: 'Utility bill', icon: Building },
    { id: 'passport', label: 'Valid passport', icon: Shield },
];

const RequirementsInput: React.FC<RequirementsInputProps> = ({
    value = [],
    onChange,
    disabled = false,
    placeholder = "Type a requirement and press Enter..."
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showPredefined, setShowPredefined] = useState(false);

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addRequirement(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            // Remove last requirement if input is empty and backspace is pressed
            removeRequirement(value.length - 1);
        }
    };

    const addRequirement = (requirement: string) => {
        if (requirement && !value.includes(requirement)) {
            onChange([...value, requirement]);
            setInputValue('');
        }
    };

    const removeRequirement = (index: number) => {
        const newRequirements = value.filter((_, i) => i !== index);
        onChange(newRequirements);
    };

    const addPredefinedRequirement = (requirement: string) => {
        addRequirement(requirement);
        setShowPredefined(false);
    };

    const availablePredefined = PREDEFINED_REQUIREMENTS.filter(
        req => !value.includes(req.label)
    );

    return (
        <div className="space-y-4">
            {/* Current Requirements Tags */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {value.map((requirement, index) => (
                            <motion.div
                                key={`${requirement}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center px-3 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium group hover:bg-primary-200 transition-colors"
                            >
                                <Check size={14} className="mr-1.5 text-primary-600" />
                                <span>{requirement}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        className="ml-2 p-0.5 hover:bg-primary-300 rounded-full transition-colors opacity-60 group-hover:opacity-100"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Input Field */}
            <div className="relative">
                <div className="flex space-x-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            disabled={disabled}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {inputValue && (
                            <button
                                type="button"
                                onClick={() => addRequirement(inputValue.trim())}
                                disabled={disabled}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>

                    {!disabled && availablePredefined.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowPredefined(!showPredefined)}
                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${showPredefined
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Quick Add
                        </button>
                    )}
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 mt-2">
                    Type a requirement and press Enter to add it, or use Quick Add for common requirements
                </p>
            </div>

            {/* Predefined Requirements */}
            <AnimatePresence>
                {showPredefined && availablePredefined.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900">Common Requirements</h4>
                            <button
                                type="button"
                                onClick={() => setShowPredefined(false)}
                                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X size={14} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {availablePredefined.map((requirement) => {
                                const IconComponent = requirement.icon;
                                return (
                                    <motion.button
                                        key={requirement.id}
                                        type="button"
                                        onClick={() => addPredefinedRequirement(requirement.label)}
                                        className="flex items-center space-x-3 p-3 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-200 rounded-lg transition-all text-left group"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                                            <IconComponent size={16} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
                                        </div>
                                        <span className="text-sm text-gray-900 group-hover:text-primary-900 transition-colors">
                                            {requirement.label}
                                        </span>
                                        <Plus size={14} className="text-gray-400 group-hover:text-primary-500 ml-auto transition-colors" />
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Requirements Counter */}
            {value.length > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{value.length} requirement{value.length !== 1 ? 's' : ''} added</span>
                    {value.length >= 8 && (
                        <span className="text-amber-600 font-medium">
                            Consider keeping requirements minimal for better user experience
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequirementsInput;