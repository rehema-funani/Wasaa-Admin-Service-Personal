import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    multiple = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter(v => v !== optionValue)
                : [...currentValues, optionValue];
            onChange(newValues);
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const getDisplayValue = () => {
        if (multiple && Array.isArray(value)) {
            if (value.length === 0) return label;
            if (value.length === 1) {
                const option = options.find(o => o.value === value[0]);
                return option?.label || label;
            }
            return `${value.length} selected`;
        } else {
            const option = options.find(o => o.value === value);
            return option?.label || label;
        }
    };

    const isSelected = (optionValue: string) => {
        if (multiple && Array.isArray(value)) {
            return value.includes(optionValue);
        }
        return value === optionValue;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
                <span className="font-medium text-gray-700">{getDisplayValue()}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="max-h-64 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                    {option.count !== undefined && (
                                        <span className="text-xs text-gray-500">({option.count})</span>
                                    )}
                                </div>
                                {isSelected(option.value) && (
                                    <Check size={16} className="text-primary-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;