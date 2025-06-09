import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, BarChart3, User, Wallet, Settings, CreditCard, Shield } from 'lucide-react';
import routes from '../../constants/routes';
import { hasPermissionForRoute } from '../../utils/permissions';

interface SearchResult {
    title: string;
    path: string;
    category: string;
    icon?: React.ComponentType<any>;
}

interface SearchBarProps {
    userPermissions: string[];
}

const SearchBar: React.FC<SearchBarProps> = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const searchInputRef = useRef<HTMLDivElement>(null);
    const searchResultsRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getAllSearchableRoutes = (): SearchResult[] => {
        const searchableRoutes: SearchResult[] = [];

        const processRoutes = (items: any[], category = '') => {
            items.forEach(item => {
                if (item.type === 'section') {
                    processRoutes(item.items, item.title);
                } else if (item.type === 'link') {
                    if (hasPermissionForRoute(item.path)) {
                        searchableRoutes.push({
                            title: item.title,
                            path: item.path,
                            category: category,
                            icon: item.icon
                        });
                    }
                } else if (item.type === 'dropdown') {
                    item.items.forEach((subItem: any) => {
                        if (hasPermissionForRoute(subItem.path)) {
                            searchableRoutes.push({
                                title: subItem.title,
                                path: subItem.path,
                                category: item.title,
                                icon: item.icon
                            });
                        }
                    });
                }
            });
        };

        processRoutes(routes);
        return searchableRoutes;
    };

    const performSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setSelectedResultIndex(-1);
            return;
        }

        const allRoutes = getAllSearchableRoutes();
        const term = searchTerm.toLowerCase();

        const filteredResults = allRoutes.filter(route =>
            route.title.toLowerCase().includes(term) ||
            route.category.toLowerCase().includes(term) ||
            route.path.toLowerCase().includes(term)
        );

        const sortedResults = filteredResults.sort((a, b) => {
            const aExactMatch = a.title.toLowerCase() === term ? -1 : 0;
            const bExactMatch = b.title.toLowerCase() === term ? -1 : 0;

            if (aExactMatch !== bExactMatch) return aExactMatch - bExactMatch;

            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }

            return a.title.localeCompare(b.title);
        });

        setSearchResults(sortedResults.slice(0, 8));
        setSelectedResultIndex(-1);
    };

    // Event handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        performSearch(value);

        if (value.trim()) {
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSearchResults || searchResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedResultIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedResultIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
                    handleResultClick(searchResults[selectedResultIndex]);
                } else if (searchResults.length > 0) {
                    handleResultClick(searchResults[0]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSearchResults(false);
                setIsSearchOpen(false);
                break;
        }
    };

    const handleResultClick = (result: SearchResult) => {
        navigate(result.path);
        setSearchValue('');
        setShowSearchResults(false);
        setIsSearchOpen(false);
    };

    // Utility functions
    const getCategoryIcon = (category: string) => {
        const iconMap: Record<string, React.ComponentType<any>> = {
            'Dashboard': BarChart3,
            'User Management': User,
            'Finance': Wallet,
            'Settings': Settings,
            'Transactions': CreditCard,
            'System': Shield,
        };

        return iconMap[category] || BarChart3;
    };

    // Group results by category for better display
    const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, result) => {
        if (!acc[result.category]) {
            acc[result.category] = [];
        }
        acc[result.category].push(result);
        return acc;
    }, {});

    return (
        <div className="relative" ref={searchInputRef}>
            {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search anything..."
                            className="w-56 md:w-80 pl-5 pr-12 py-3 rounded-2xl border border-secondary-200/20 dark:border-dark-border focus:border-secondary-400 dark:focus:border-secondary-600 focus:outline-none focus:ring-4 focus:ring-secondary-300/20 dark:focus:ring-secondary-700/20 transition-all duration-300 text-sm font-medium bg-white/10 dark:bg-dark-input backdrop-blur-sm shadow-lg text-gray-800 dark:text-neutral-200 placeholder-secondary-200/60 dark:placeholder-neutral-500"
                            autoFocus
                        />
                        <button
                            onClick={() => {
                                setIsSearchOpen(false);
                                setSearchValue('');
                                setShowSearchResults(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-secondary-700/30 dark:hover:bg-dark-hover transition-all duration-200 text-secondary-200 dark:text-neutral-500"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-xl hover:bg-secondary-600/40 dark:hover:bg-dark-hover transition-all duration-300 transform hover:scale-110 group text-gray-800/70 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white"
                >
                    <Search size={18} className="transition-colors duration-300" />
                </button>
            )}

            {showSearchResults && searchResults.length > 0 && (
                <div
                    ref={searchResultsRef}
                    className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md rounded-2xl border border-secondary-100/30 dark:border-dark-border shadow-xl dark:shadow-dark-md z-50 overflow-hidden animate-fadeIn"
                >
                    <div className="p-4">
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mb-3">
                            {searchResults.length} results found for "{searchValue}"
                        </div>

                        <div className="space-y-4">
                            {Object.entries(groupedResults).map(([category, results]) => (
                                <div key={category}>
                                    <div className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center">
                                        {React.createElement(getCategoryIcon(category), {
                                            size: 14,
                                            className: "inline mr-1 text-gray-400 dark:text-neutral-500"
                                        })}
                                        {category}
                                    </div>
                                    <div className="space-y-1">
                                        {results.map((result, index) => {
                                            const globalIndex = searchResults.findIndex(r =>
                                                r.title === result.title && r.path === result.path && r.category === result.category
                                            );
                                            const isSelected = globalIndex === selectedResultIndex;

                                            return (
                                                <div
                                                    key={`${result.path}-${index}`}
                                                    onClick={() => handleResultClick(result)}
                                                    onMouseEnter={() => setSelectedResultIndex(globalIndex)}
                                                    className={`
                            cursor-pointer p-2 rounded-lg transition-all duration-150 flex items-center
                            ${isSelected ? 'bg-secondary-50/80 dark:bg-dark-active text-secondary-700 dark:text-secondary-300' : 'hover:bg-gray-50/80 dark:hover:bg-dark-hover'}
                          `}
                                                >
                                                    <div className={`
                            p-1.5 rounded-lg mr-2
                            ${isSelected ? 'bg-secondary-100 dark:bg-secondary-900/30' : 'bg-gray-50 dark:bg-dark-hover'}
                          `}>
                                                        {result.icon ?
                                                            <result.icon size={16} className="text-secondary-500 dark:text-secondary-400" /> :
                                                            React.createElement(getCategoryIcon(result.category), {
                                                                size: 16,
                                                                className: "text-secondary-500 dark:text-secondary-400"
                                                            })
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm truncate dark:text-neutral-200">
                                                            {result.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                                                            {result.path}
                                                        </div>
                                                    </div>
                                                    <div className={`
                            ml-2 p-1 rounded-full
                            ${isSelected ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400' : 'text-gray-400 dark:text-neutral-500'}
                          `}>
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border text-xs text-gray-500 dark:text-neutral-500 flex items-center justify-between">
                            <span>
                                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-neutral-400 mx-1">↑</kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-neutral-400 mx-1">↓</kbd>
                                to navigate
                            </span>
                            <span>
                                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-neutral-400 mx-1">Enter</kbd>
                                to select
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;