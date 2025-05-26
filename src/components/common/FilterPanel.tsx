import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    ChevronDown,
    Check,
    Search,
    RefreshCw,
    Calendar,
    X,
    Sliders
} from 'lucide-react';

export interface FilterOption {
    id: string;
    label: string;
    type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number' | 'boolean';
    options?: { value: string; label: string }[];
    defaultValue?: any;
}

interface FilterPanelProps {
    title?: string;
    filters: FilterOption[];
    onApplyFilters: (filters: Record<string, any>) => void;
    onResetFilters?: () => void;
    initialExpanded?: boolean;
    className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    title = 'Filters',
    filters,
    onApplyFilters,
    onResetFilters,
    initialExpanded = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(initialExpanded);
    const [filterValues, setFilterValues] = useState<Record<string, any>>(() => {
        const initialValues: Record<string, any> = {};
        filters.forEach(filter => {
            if (filter.defaultValue !== undefined) {
                initialValues[filter.id] = filter.defaultValue;
            } else {
                switch (filter.type) {
                    case 'select':
                        initialValues[filter.id] = '';
                        break;
                    case 'multiselect':
                        initialValues[filter.id] = [];
                        break;
                    case 'date':
                    case 'daterange':
                        initialValues[filter.id] = null;
                        break;
                    case 'text':
                        initialValues[filter.id] = '';
                        break;
                    case 'number':
                        initialValues[filter.id] = '';
                        break;
                    case 'boolean':
                        initialValues[filter.id] = false;
                        break;
                }
            }
        });
        return initialValues;
    });

    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (filterId: string, value: any) => {
        setFilterValues(prev => ({
            ...prev,
            [filterId]: value
        }));
    };

    const handleCheckboxChange = (filterId: string, value: string, isMulti: boolean) => {
        setFilterValues(prev => {
            if (isMulti) {
                const currentValues = prev[filterId] || [];
                if (currentValues.includes(value)) {
                    return {
                        ...prev,
                        [filterId]: currentValues.filter((v: string) => v !== value)
                    };
                } else {
                    return {
                        ...prev,
                        [filterId]: [...currentValues, value]
                    };
                }
            } else {
                return {
                    ...prev,
                    [filterId]: value === prev[filterId] ? '' : value
                };
            }
        });
    };

    const handleApplyFilters = () => {
        const activeFilters = Object.entries(filterValues).filter(([_, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'string') return value.trim() !== '';
            if (typeof value === 'boolean') return value;
            return value !== null && value !== undefined;
        });

        setActiveFiltersCount(activeFilters.length);
        onApplyFilters(filterValues);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        const initialValues: Record<string, any> = {};

        filters.forEach(filter => {
            switch (filter.type) {
                case 'select':
                    initialValues[filter.id] = '';
                    break;
                case 'multiselect':
                    initialValues[filter.id] = [];
                    break;
                case 'date':
                case 'daterange':
                    initialValues[filter.id] = null;
                    break;
                case 'text':
                case 'number':
                    initialValues[filter.id] = '';
                    break;
                case 'boolean':
                    initialValues[filter.id] = false;
                    break;
            }
        });

        setFilterValues(initialValues);
        setActiveFiltersCount(0);
        if (onResetFilters) onResetFilters();
    };

    const renderFilterInput = (filter: FilterOption) => {
        switch (filter.type) {
            case 'select':
                return (
                    <div className="relative">
                        <select
                            id={filter.id}
                            value={filterValues[filter.id] || ''}
                            onChange={(e) => handleInputChange(filter.id, e.target.value)}
                            className="w-full py-2.5 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-100 appearance-none"
                        >
                            <option value="">All</option>
                            {filter.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <ChevronDown size={16} className="text-gray-400" strokeWidth={1.5} />
                        </div>
                    </div>
                );

            case 'multiselect':
                return (
                    <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-2xl bg-gray-50/40">
                        {filter.options?.map(option => (
                            <motion.div
                                key={option.value}
                                className="flex items-center"
                                whileHover={{ x: 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <motion.div
                                    className={`
                    w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer
                    ${filterValues[filter.id]?.includes(option.value)
                                            ? 'border-primary-500 bg-primary-500'
                                            : 'border-gray-300 bg-white'}
                  `}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCheckboxChange(filter.id, option.value, true)}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    {filterValues[filter.id]?.includes(option.value) && (
                                        <Check size={12} className="text-white" strokeWidth={3} />
                                    )}
                                </motion.div>
                                <label
                                    htmlFor={`${filter.id}-${option.value}`}
                                    className="ml-2.5 text-sm text-gray-700 cursor-pointer"
                                >
                                    {option.label}
                                </label>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'date':
                return (
                    <div className="relative">
                        <input
                            type="date"
                            id={filter.id}
                            value={filterValues[filter.id] || ''}
                            onChange={(e) => handleInputChange(filter.id, e.target.value)}
                            className="w-full py-2.5 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <Calendar size={16} className="text-gray-400" strokeWidth={1.5} />
                        </div>
                    </div>
                );

            case 'daterange':
                return (
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                id={`${filter.id}-from`}
                                value={filterValues[filter.id]?.from || ''}
                                onChange={(e) => handleInputChange(filter.id, {
                                    ...filterValues[filter.id],
                                    from: e.target.value
                                })}
                                className="w-full py-2.5 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                                placeholder="From"
                            />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="date"
                                id={`${filter.id}-to`}
                                value={filterValues[filter.id]?.to || ''}
                                onChange={(e) => handleInputChange(filter.id, {
                                    ...filterValues[filter.id] || {},
                                    to: e.target.value
                                })}
                                className="w-full py-2.5 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                                placeholder="To"
                            />
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className="relative">
                        <input
                            type="text"
                            id={filter.id}
                            value={filterValues[filter.id] || ''}
                            onChange={(e) => handleInputChange(filter.id, e.target.value)}
                            className="w-full py-2.5 pl-10 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                            placeholder={`Search ${filter.label.toLowerCase()}...`}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Search size={14} className="text-gray-400" strokeWidth={1.5} />
                        </div>
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        id={filter.id}
                        value={filterValues[filter.id] || ''}
                        onChange={(e) => handleInputChange(filter.id, e.target.value)}
                        className="w-full py-2.5 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                    />
                );

            case 'boolean':
                return (
                    <div className="flex items-center">
                        <motion.div
                            className={`
                w-12 h-6 rounded-full flex items-center border-2 
                ${filterValues[filter.id]
                                    ? 'bg-primary-500 border-primary-500 justify-end'
                                    : 'bg-gray-100 border-gray-200 justify-start'}
                cursor-pointer transition-colors
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleInputChange(filter.id, !filterValues[filter.id])}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full shadow-sm mx-0.5"
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </motion.div>
                        <span className={`ml-2.5 text-sm ${filterValues[filter.id] ? 'text-primary-500 font-medium' : 'text-gray-500'}`}>
                            {filterValues[filter.id] ? 'Yes' : 'No'}
                        </span>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <motion.button
                onClick={toggleModal}
                className={`flex justify-end items-center space-x-2 py-2 px-3 rounded-full text-sm font-medium bg-white border border-gray-100 shadow-sm ${className}`}
                whileHover={{ scale: 1.02, boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)' }}
                whileTap={{ scale: 0.98 }}
            >
                <Sliders size={14} className="text-primary-500" strokeWidth={1.5} />
                <span className="text-gray-700">{title}</span>
                {activeFiltersCount > 0 && (
                    <span className="ml-1 w-5 h-5 bg-primary-500 text-white rounded-full text-xs flex items-center justify-center">
                        {activeFiltersCount}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            ref={modalRef}
                            className="fixed inset-x-0 bottom-0 z-50 p-5 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:w-full"
                            initial={{
                                y: "100%",
                                x: window.innerWidth >= 640 ? "-50%" : 0,
                                opacity: 0.8,
                                scale: 0.95
                            }}
                            animate={{
                                y: window.innerWidth >= 640 ? "-50%" : 0,
                                x: window.innerWidth >= 640 ? "-50%" : 0,
                                opacity: 1,
                                scale: 1
                            }}
                            exit={{
                                y: "100%",
                                x: window.innerWidth >= 640 ? "-50%" : 0,
                                opacity: 0.8,
                                scale: 0.95
                            }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300
                            }}
                        >
                            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="flex justify-center pt-3 pb-1">
                                    <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                                </div>

                                <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex w-full items-center space-x-2">
                                        <Filter size={16} className="text-primary-500" strokeWidth={1.5} />
                                        <h3 className="font-medium text-gray-700">{title}</h3>
                                        {activeFiltersCount > 0 && (
                                            <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </div>
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <X size={16} strokeWidth={1.5} />
                                    </motion.button>
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto p-5 bg-gray-50/50 space-y-5">
                                    {filters.map((filter, index) => (
                                        <motion.div
                                            key={filter.id}
                                            className="space-y-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <label
                                                htmlFor={filter.id}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {filter.label}
                                            </label>
                                            {renderFilterInput(filter)}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="px-5 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
                                    <motion.button
                                        className="text-sm text-gray-500 flex items-center"
                                        whileHover={{ scale: 1.03, color: '#4f46e5' }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleResetFilters}
                                    >
                                        <RefreshCw size={12} className="mr-1.5" strokeWidth={1.5} />
                                        Reset all
                                    </motion.button>

                                    <div className="flex space-x-2">
                                        <motion.button
                                            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-full text-sm"
                                            whileHover={{ scale: 1.03, backgroundColor: '#f9fafb' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </motion.button>

                                        <motion.button
                                            className="px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm shadow-sm"
                                            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleApplyFilters}
                                        >
                                            Apply
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default FilterPanel;