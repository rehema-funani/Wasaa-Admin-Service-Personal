import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight, AlertCircle } from 'lucide-react';

interface SearchBoxProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    onClear?: () => void;
    suggestions?: string[];
    recentSearches?: string[];
    loading?: boolean;
    error?: string;
    className?: string;
    showRecentByDefault?: boolean;
    showSuggestions?: boolean;
    autoFocus?: boolean;
    minLength?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    placeholder = 'Search...',
    onSearch,
    onClear,
    suggestions = [],
    recentSearches = [],
    loading = false,
    error = '',
    className = '',
    showRecentByDefault = true,
    showSuggestions = true,
    autoFocus = false,
    minLength = 2
}) => {
    const [query, setQuery] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showRecent, setShowRecent] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    // Effect for handling click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                setShowRecent(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect for autofocus
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length >= minLength) {
            onSearch(value);
        } else if (value === '' && onClear) {
            onClear();
        }
    };

    const handleInputFocus = () => {
        setIsFocused(true);
        if (showRecentByDefault && query.length === 0 && recentSearches.length > 0) {
            setShowRecent(true);
        }
    };

    const handleInputBlur = () => {
        // Delay to allow click on suggestion
        setTimeout(() => {
            if (document.activeElement !== inputRef.current) {
                setIsFocused(false);
            }
        }, 150);
    };

    const handleClear = () => {
        setQuery('');
        if (onClear) onClear();
        if (inputRef.current) inputRef.current.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            onSearch(query);
            setIsFocused(false);
            setShowRecent(false);
        } else if (e.key === 'Escape') {
            setIsFocused(false);
            setShowRecent(false);
            inputRef.current?.blur();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setIsFocused(false);
        setShowRecent(false);
    };

    const filteredSuggestions = showSuggestions
        ? suggestions.filter(s =>
            s.toLowerCase().includes(query.toLowerCase()) &&
            s.toLowerCase() !== query.toLowerCase()
        )
        : [];

    return (
        <div
            ref={boxRef}
            className={`relative ${className}`}
        >
            <motion.div
                className="flex w-fit items-center bg-gray-50/70 backdrop-blur-sm border-0 rounded-full transition-all overflow-hidden"
                initial={false}
                animate={{
                    backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.95)' : 'rgba(249, 250, 251, 0.7)',
                    boxShadow: isFocused
                        ? '0 0 0 1px rgba(99, 102, 241, 0.2), 0 2px 4px rgba(0, 0, 0, 0.05)'
                        : '0 0 0 1px rgba(0, 0, 0, 0.05)'
                }}
                transition={{ duration: 0.2 }}
                whileHover={{
                    boxShadow: isFocused
                        ? '0 0 0 1px rgba(99, 102, 241, 0.2), 0 3px 8px rgba(0, 0, 0, 0.05)'
                        : '0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.03)'
                }}
            >
                <motion.div
                    className="flex-shrink-0 pl-4"
                    animate={{
                        scale: isFocused ? 1.05 : 1,
                        color: isFocused ? 'rgba(99, 102, 241, 0.8)' : 'rgba(156, 163, 175, 0.8)'
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <Search
                        size={16}
                        strokeWidth={1.5}
                        className={loading ? 'animate-pulse' : ''}
                    />
                </motion.div>

                <input
                    ref={inputRef}
                    type="text"
                    className="py-2 border-none px-3 w-full md:w-[300px] bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                />

                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClear}
                            className="flex-shrink-0 p-1.5 mr-3 text-gray-400 hover:text-gray-600 rounded-full"
                            aria-label="Clear search"
                        >
                            <X size={14} strokeWidth={1.5} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {(isFocused && (filteredSuggestions.length > 0 || (showRecent && recentSearches.length > 0) || error)) && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden z-10"
                    >
                        {error && (
                            <div className="p-3 bg-red-50/50 text-red-600 text-xs flex items-start">
                                <AlertCircle size={14} className="mr-2 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                <span>{error}</span>
                            </div>
                        )}

                        {showRecent && recentSearches.length > 0 && query.length === 0 && (
                            <div>
                                <div className="px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50/40">
                                    Recent Searches
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {recentSearches.map((search, index) => (
                                        <motion.button
                                            key={`recent-${index}`}
                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-600 flex items-center"
                                            whileHover={{ x: 2, backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                                            onClick={() => handleSuggestionClick(search)}
                                        >
                                            <Clock size={12} className="mr-2.5 text-gray-400" strokeWidth={1.5} />
                                            {search}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredSuggestions.length > 0 && query.length >= minLength && (
                            <div>
                                <div className="px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50/40">
                                    Suggestions
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={`suggestion-${index}`}
                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-600 flex items-center justify-between"
                                            whileHover={{ x: 2, backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <div className="flex items-center flex-grow overflow-hidden">
                                                <Search size={12} className="mr-2.5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                                                <span className="truncate">{suggestion}</span>
                                            </div>
                                            <motion.div
                                                className="text-primary-400 ml-2 flex-shrink-0 opacity-0"
                                                whileHover={{ opacity: 1, x: 2 }}
                                            >
                                                <ArrowRight size={12} strokeWidth={1.5} />
                                            </motion.div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBox;