import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from 'lodash';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
    debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search...',
    value: controlledValue,
    onChange,
    onSearch,
    debounceMs = 300
}) => {
    const [internalValue, setInternalValue] = useState('');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            if (onSearch) {
                onSearch(searchValue);
            }
        }, debounceMs),
        [onSearch, debounceMs]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onChange(newValue);
        debouncedSearch(newValue);
    };

    const handleClear = () => {
        if (controlledValue === undefined) {
            setInternalValue('');
        }
        onChange('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="pl-9 pr-9 py-2 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm transition-all"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;