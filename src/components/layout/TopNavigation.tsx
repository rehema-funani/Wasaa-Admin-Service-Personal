import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    ChevronDown, Search, X, Bell,
    ArrowRight, Menu, User,
    Settings, LogOut, CreditCard,
    AlertCircle, BarChart3,
    Shield, 
    Wallet
} from 'lucide-react';
import Cookies from 'js-cookie';
import routes from '../../constants/routes';
import logo from '../../assets/images/logo-wasaa.png';

const getRequiredPermissionsForRoute = (path: string) => {
    const routePermissionsMap = {
        '/': [],

        '/admin/users/user-details': ['can_list_users', 'can_view_users'],
        '/admin/users/countrywise-Analysis': ['can_list_users', 'can_view_users'],
        '/admin/users/reported-user-list': ['can_view_reported_users', 'can_list_reports', 'can_view_reports'],

        '/admin/Group/all-group-list': ['can_list_groups', 'can_view_groups'],
        '/admin/Group/all-reported-group-list': ['can_view_reported_groups', 'can_list_reports', 'can_view_reports'],

        '/admin/system/users': ['can_list_staff', 'can_view_users'],
        '/admin/system/roles': ['can_list_roles', 'can_view_roles'],

        '/admin/livestreams/all-livestreams': [],
        '/admin/livestreams/scheduled': [],
        '/admin/livestreams/settings': [],
        '/admin/livestreams/categories': [],
        '/admin/livestreams/featured': [],
        '/admin/livestreams/analytics': [],
        '/admin/livestreams/moderation': [],
        '/admin/livestreams/reported': ['can_list_reports', 'can_view_reports'],

        '/admin/finance/transactions': [],
        '/admin/finance/user-wallets': [],
        '/admin/finance/withdrawals': [],
        '/admin/finance/top-ups': [],
        '/admin/finance/payment-methods': [],
        '/admin/finance/reports': [],
        '/admin/finance/gift-history': [],

        '/admin/gifts/add-gift': ['can_create_media'],
        '/admin/gifts/gift-list': ['can_list_media', 'can_view_media'],
        '/admin/gifts/gift-categories': ['can_list_media', 'can_view_media'],

        '/admin/settings': ['can_view_settings', 'can_update_settings'],
        '/admin/languages': ['can_list_languages', 'can_view_languages'],
        '/admin/logs': [],
        '/admin/support': [],

        '/admin/Wallpaper/list-all-wallpaper': ['can_list_media', 'can_view_media'],
        '/admin/Wallpaper/add-a-new-wallpaper': ['can_create_media'],
        '/admin/Avatar/list-all-avatar': ['can_list_media', 'can_view_media'],
        '/admin/Avatar/add-a-new-avatar': ['can_create_media'],

        '/admin/users/user-details/:id': ['can_view_users'],
        '/admin/users/countrywise-Analysis/:id': ['can_view_users'],
        '/admin/Group/all-group-list/:id': ['can_view_groups'],
        '/admin/system/roles/:id': ['can_view_roles'],
        '/admin/system/roles/create': ['can_create_roles'],
        '/admin/finance/user-wallets/:id': [],
        '/admin/languages/:id/translations': ['can_view_languages'],

        '/admin/support/teams': [],
        '/admin/support/teams/:id': [],
        '/admin/support/tickets': [],
        '/admin/support/tickets/:id': [],
        '/admin/support/assignments': [],
    };

    if (!routePermissionsMap[path]) {
        const pathParts = path.split('/');
        const possibleRoutes = Object.keys(routePermissionsMap);

        for (const route of possibleRoutes) {
            const routeParts = route.split('/');

            if (routeParts.length === pathParts.length) {
                let isMatch = true;

                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(':') || routeParts[i] === pathParts[i]) {
                        continue;
                    } else {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch) {
                    return routePermissionsMap[route];
                }
            }
        }
    }

    return routePermissionsMap[path] || [];
};

const hasPermissionForRoute = (path: string, userPermissions: any) => {
    const requiredPermissions = getRequiredPermissionsForRoute(path);
    if (requiredPermissions.length === 0) {
        return true;
    }
    return requiredPermissions.some(permission => userPermissions.includes(permission));
};

const TopNavigation = ({ toggleDarkMode, isDarkMode }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(3);

    const dropdownRefs = useRef({});
    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);
    const notificationsRef = useRef(null);
    const userMenuRef = useRef(null);

    const navigate = useNavigate();

    const user = Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null;
    const userPermissions = user?.permissions || [];

    const notifications = [
        { id: 1, title: 'New transaction', description: 'Payment of $5,000 received', time: '2m ago', read: false, type: 'transaction' },
        { id: 2, title: 'Risk alert', description: 'Unusual activity detected on wallet #4829', time: '1h ago', read: false, type: 'alert' },
        { id: 3, title: 'System update', description: 'System maintenance completed successfully', time: '3h ago', read: false, type: 'system' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event: any) => {
            if (activeDropdown) {
                const ref = dropdownRefs.current[activeDropdown];
                if (ref && !ref.contains(event.target)) {
                    setActiveDropdown(null);
                    setActiveNestedDropdown(null);
                }
            }

            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }

            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }

            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    const getAllSearchableRoutes = () => {
        const searchableRoutes = [];

        const processRoutes = (items, category = '') => {
            items.forEach(item => {
                if (item.type === 'section') {
                    processRoutes(item.items, item.title);
                } else if (item.type === 'link') {
                    if (hasPermissionForRoute(item.path, userPermissions)) {
                        searchableRoutes.push({
                            title: item.title,
                            path: item.path,
                            category: category,
                            icon: item.icon
                        });
                    }
                } else if (item.type === 'dropdown') {
                    item.items.forEach(subItem => {
                        if (hasPermissionForRoute(subItem.path, userPermissions)) {
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

    const handleSearchChange = (e:any) => {
        const value = e.target.value;
        setSearchValue(value);
        performSearch(value);

        if (value.trim()) {
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    };

    const handleSearchKeyDown = (e: any) => {
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

    const handleResultClick = (result: any) => {
        navigate(result.path);
        setSearchValue('');
        setShowSearchResults(false);
        setIsSearchOpen(false);
    };

    const markAllAsRead = () => {
        setUnreadNotifications(0);
    };

    const getNotificationIcon = (type: any) => {
        switch (type) {
            case 'transaction':
                return (
                    <div className="p-2 rounded-full bg-emerald-50 border border-emerald-100">
                        <CreditCard size={16} className="text-emerald-500" />
                    </div>
                );
            case 'alert':
                return (
                    <div className="p-2 rounded-full bg-amber-50 border border-amber-100">
                        <AlertCircle size={16} className="text-amber-500" />
                    </div>
                );
            case 'system':
                return (
                    <div className="p-2 rounded-full bg-primary-50 border border-primary-100">
                        <Shield size={16} className="text-primary-500" />
                    </div>
                );
            default:
                return (
                    <div className="p-2 rounded-full bg-secondary-50 border border-secondary-100">
                        <Bell size={16} className="text-secondary-500" />
                    </div>
                );
        }
    };

    const handleNestedDropdownToggle = (key: any) => {
        setActiveNestedDropdown(activeNestedDropdown === key ? null : key);
    };

    const filterItems = (items: any) => {
        return items.filter(item => {
            if (item.type === 'link') {
                return hasPermissionForRoute(item.path, userPermissions);
            } else if (item.type === 'dropdown') {
                const filteredDropdownItems = item.items.filter(subItem =>
                    hasPermissionForRoute(subItem.path, userPermissions)
                );
                return filteredDropdownItems.length > 0;
            }
            return true;
        });
    };

    const filterSections = (sections: any) => {
        return sections.filter(section => {
            if (section.type !== 'section') return true;

            const filteredItems = filterItems(section.items);
            return filteredItems.length > 0;
        });
    };

    const renderNestedDropdown = (dropdown: any) => {
        const isActive = activeNestedDropdown === dropdown.key;
        const filteredItems = dropdown.items.filter(item =>
            hasPermissionForRoute(item.path, userPermissions)
        );

        if (filteredItems.length === 0) return null;

        return (
            <div key={dropdown.key} className="relative">
                <button
                    onClick={() => handleNestedDropdownToggle(dropdown.key)}
                    className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-secondary-100/80 to-primary-100/80 text-secondary-700 dark:from-secondary-900/40 dark:to-primary-900/40 dark:text-secondary-300'
                        : 'hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80 dark:hover:from-dark-hover dark:hover:to-dark-active/70'
                        }`}
                >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 mr-4 shadow-sm ${isActive
                        ? 'bg-gradient-to-br from-secondary-200 to-primary-200 dark:from-secondary-800/40 dark:to-primary-800/40'
                        : 'bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-secondary-100 group-hover:to-primary-100 dark:from-dark-elevated dark:to-dark-active dark:group-hover:from-secondary-900/30 dark:group-hover:to-primary-900/30'
                        }`}>
                        <dropdown.icon size={20} className={`transition-colors duration-300 ${isActive
                            ? 'text-secondary-700 dark:text-secondary-300'
                            : 'text-slate-600 dark:text-neutral-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400'
                            }`} />
                    </div>
                    <div className="flex-1 text-left">
                        <span className={`text-sm font-semibold transition-colors duration-300 ${isActive
                            ? 'text-secondary-700 dark:text-secondary-300'
                            : 'text-slate-700 dark:text-neutral-300 group-hover:text-secondary-700 dark:group-hover:text-secondary-400'
                            }`}>
                            {dropdown.title}
                        </span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`transition-all duration-300 ${isActive
                            ? 'rotate-180 text-secondary-600 dark:text-secondary-400'
                            : 'text-slate-400 dark:text-neutral-500 group-hover:text-secondary-500 dark:group-hover:text-secondary-500'
                            }`}
                    />
                </button>

                {isActive && (
                    <div className="ml-4 mt-2 space-y-1 animate-fadeIn">
                        {filteredItems.map((subItem, subIdx) => (
                            <NavLink
                                key={subIdx}
                                to={subItem.path}
                                className="group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-secondary-50/60 hover:to-primary-50/60 
                                    dark:hover:from-dark-hover dark:hover:to-dark-active/50
                                    transition-all duration-300 transform hover:translate-x-1"
                            // activeClassName="bg-secondary-50/80 dark:bg-dark-active/80"
                            >
                                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-dark-border group-hover:bg-secondary-400 dark:group-hover:bg-secondary-600 transition-colors duration-300 mr-4 flex-shrink-0
                                    navlink-active:bg-secondary-400 dark:navlink-active:bg-secondary-500"
                                ></div>
                                <span className="text-sm text-slate-600 dark:text-neutral-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors duration-300
                                    navlink-active:text-secondary-700 dark:navlink-active:text-secondary-300"
                                >
                                    {subItem.title}
                                </span>
                                <ArrowRight size={14} className="text-slate-300 dark:text-neutral-600 group-hover:text-secondary-400 dark:group-hover:text-secondary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 ml-auto" />
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderMegaMenu = (section: any) => {
        const filteredItems = filterItems(section.items);

        if (filteredItems.length === 0) return null;

        return (
            <div className="absolute top-full left-0 mt-3 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-2xl rounded-3xl shadow-2xl dark:shadow-dark-lg border border-white/20 dark:border-dark-border overflow-hidden z-50 animate-fadeIn min-w-[400px] max-w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/40 dark:from-dark-elevated dark:via-dark-elevated dark:to-dark-surface -z-10"></div>
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-[0.15em] mb-1">{section.title}</h3>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        {filteredItems.map((item: any, idx: any) => {
                            if (item.type === 'link') {
                                return (
                                    <NavLink
                                        key={idx}
                                        to={item.path}
                                        className="group flex items-center p-4 rounded-2xl 
                                            hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80 
                                            dark:hover:from-dark-hover dark:hover:to-dark-active/70
                                            transition-all duration-300 transform hover:translate-x-1"
                                    // activeClassName="bg-secondary-50/60 dark:bg-dark-active/60"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl
                                            bg-gradient-to-br from-slate-100 to-slate-50 dark:from-dark-elevated dark:to-dark-active 
                                            group-hover:from-secondary-100 group-hover:to-primary-100 
                                            dark:group-hover:from-secondary-900/30 dark:group-hover:to-primary-900/30
                                            group-[.active]:from-secondary-100 group-[.active]:to-primary-100 
                                            dark:group-[.active]:from-secondary-900/30 dark:group-[.active]:to-primary-900/30
                                            transition-all duration-300 mr-4 shadow-sm dark:shadow-dark-sm group-hover:shadow-md dark:group-hover:shadow-dark"
                                        >
                                            <item.icon size={20} className="text-slate-600 dark:text-neutral-400 
                                                group-hover:text-secondary-600 dark:group-hover:text-secondary-400
                                                group-[.active]:text-secondary-600 dark:group-[.active]:text-secondary-400
                                                transition-colors duration-300" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300 
                                                group-hover:text-secondary-700 dark:group-hover:text-secondary-400
                                                group-[.active]:text-secondary-700 dark:group-[.active]:text-secondary-300
                                                transition-colors duration-300 block">
                                                {item.title}
                                            </span>
                                            {item.description && (
                                                <span className="text-xs text-slate-500 dark:text-neutral-500 
                                                    group-hover:text-secondary-500 dark:group-hover:text-secondary-500
                                                    group-[.active]:text-secondary-500 dark:group-[.active]:text-secondary-500
                                                    transition-colors duration-300 mt-1 block">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight size={16} className="text-slate-400 dark:text-neutral-600 group-hover:text-secondary-500 dark:group-hover:text-secondary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                                    </NavLink>
                                );
                            } else if (item.type === 'dropdown') {
                                return renderNestedDropdown(item);
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderNavItem = (item: any) => {
        if (item.type === 'link') {
            if (!hasPermissionForRoute(item.path, userPermissions)) {
                return null;
            }

            return (
                <NavLink
                    to={item.path}
                    className="group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105
                        text-slate-600 dark:text-neutral-300 hover:text-secondary-700 dark:hover:text-secondary-400 
                        hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-primary-50/50 
                        dark:hover:from-dark-hover dark:hover:to-dark-active/70"
                // activeClassName="text-secondary-700 dark:text-secondary-300 bg-gradient-to-r from-secondary-50/80 to-primary-50/80 dark:from-secondary-900/30 dark:to-primary-900/30 shadow-sm dark:shadow-dark-sm"
                >
                    <item.icon size={18} className="mr-3 group-hover:scale-110 transition-transform duration-300 dark:text-neutral-400 group-[.active]:text-secondary-600 dark:group-[.active]:text-secondary-400" />
                    <span>{item.title}</span>
                </NavLink>
            );
        } else if (item.type === 'section') {
            const filteredItems = filterItems(item.items);

            if (filteredItems.length === 0) {
                return null;
            }

            return (
                <div
                    className="relative"
                    ref={el => { dropdownRefs.current[item.title] = el; }}
                >
                    <button
                        onClick={() => {
                            const newActiveDropdown = activeDropdown === item.title ? null : item.title;
                            setActiveDropdown(newActiveDropdown);
                            setActiveNestedDropdown(null);
                        }}
                        className={`group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 
                            text-slate-600 dark:text-neutral-300 hover:text-secondary-700 dark:hover:text-secondary-400 
                            hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-primary-50/50 
                            dark:hover:from-dark-hover dark:hover:to-dark-active/70
                            ${activeDropdown === item.title
                                ? '!text-secondary-700 dark:!text-secondary-300 !bg-gradient-to-r !from-secondary-50 !to-primary-50 dark:!from-secondary-900/30 dark:!to-primary-900/30 shadow-sm dark:shadow-dark-sm'
                                : ''}
                        `}
                    >
                        <span>{item.title}</span>
                        <ChevronDown
                            size={16}
                            className={`ml-2 transition-all duration-300 ${activeDropdown === item.title
                                ? 'rotate-180 text-secondary-600 dark:text-secondary-400'
                                : 'text-slate-400 dark:text-neutral-500 group-hover:text-secondary-500 dark:group-hover:text-secondary-500'
                                }`}
                        />
                    </button>
                    {activeDropdown === item.title && renderMegaMenu(item)}
                </div>
            );
        }
        return null;
    };

    const groupedResults = searchResults.reduce<Record<string, typeof searchResults>>((acc, result) => {
        if (!acc[result.category]) {
            acc[result.category] = [];
        }
        acc[result.category].push(result);
        return acc;
    }, {});

    const handleLogout = () => {
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userData');
        navigate('/auth/login');
    };

    const getCategoryIcon = (category: any) => {
        const iconMap = {
            'Dashboard': BarChart3,
            'User Management': User,
            'Finance': Wallet,
            'Settings': Settings,
            'Transactions': CreditCard,
            'System': Shield,
        };

        return iconMap[category] || BarChart3;
    };

    return (
        <div className="fixed top-0 right-0 z-40 left-[60px] w-[calc(100%-60px)]">
            <div className={`transition-all duration-500 ${scrolled
                ? 'bg-white dark:bg-dark-surface backdrop-blur-xl shadow-xl shadow-secondary-900/20 dark:shadow-dark-lg'
                : 'bg-whitee dark:bg-dark-surface backdrop-blur-2xl'
                }`}>
                <div className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center mr-2 lg:mr-12">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-[200px] h-auto cursor-pointer"
                            onClick={() => navigate('/')}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <nav className="hidden xl:flex items-center flex-1 justify-center">
                        <div className="flex items-center space-x-2 bg-white dark:bg-dark-elevated backdrop-blur-md rounded-3xl p-2 shadow-inner shadow-primary-400 dark:shadow-dark-sm">
                            {filterSections(routes).map((item: any, idx: any) => (
                                <div key={idx}>
                                    {renderNavItem(item)}
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-1 md:space-x-3">
                        {/* Dark Mode Toggle */}
                        {/* <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-xl hover:bg-secondary-600/40 dark:hover:bg-dark-hover transition-all duration-300 transform hover:scale-110 group text-gray-800/70 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white"
                        >
                            {isDarkMode ? (
                                <Sun size={18} className="text-amber-400" />
                            ) : (
                                <Moon size={18} className="text-secondary-600" />
                            )}
                        </button> */}

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
                                                        {React.createElement(getCategoryIcon(category), { size: 14, className: "inline mr-1 text-gray-400 dark:text-neutral-500" })}
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
                                                                        {result.icon ? <result.icon size={16} className="text-secondary-500 dark:text-secondary-400" /> :
                                                                            React.createElement(getCategoryIcon(result.category), { size: 16, className: "text-secondary-500 dark:text-secondary-400" })}
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

                        <div className="relative" ref={notificationsRef}>
                            <button
                                className="p-2.5 rounded-xl hover:bg-secondary-600/40 dark:hover:bg-dark-hover transition-all duration-300 transform hover:scale-110 group text-gray-800/70 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white relative"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                            >
                                <Bell size={18} className="transition-colors duration-300" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 dark:bg-rose-600 rounded-full shadow-lg shadow-rose-500/50 dark:shadow-rose-600/50 animate-pulse"></span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md rounded-2xl border border-secondary-100/30 dark:border-dark-border shadow-xl dark:shadow-dark-md z-50 overflow-hidden animate-fadeIn">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
                                        <h3 className="font-medium text-gray-800 dark:text-neutral-200">Notifications</h3>
                                        {unreadNotifications > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`
                                                    px-4 py-3 hover:bg-secondary-50/50 dark:hover:bg-dark-hover cursor-pointer relative
                                                    ${!notification.read ? 'bg-secondary-50/30 dark:bg-dark-active/30' : ''}
                                                `}
                                            >
                                                <div className="flex items-start">
                                                    <div className="mt-0.5 mr-3">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">{notification.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{notification.description}</p>
                                                        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{notification.time}</p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="absolute top-3 right-3 w-2 h-2 bg-secondary-500 dark:bg-secondary-400 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-4 py-2 border-t border-gray-100 dark:border-dark-border">
                                        <button className="w-full text-xs text-center text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium py-1">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative ml-2" ref={userMenuRef}>
                            <button
                                className="flex items-center space-x-2 py-1.5 px-2 rounded-xl transition-all hover:bg-secondary-600/40 dark:hover:bg-dark-hover text-gray-800/90 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white group"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="w-8 h-8 rounded-xl bg-secondary-600/60 dark:bg-secondary-700/40 backdrop-blur-sm flex items-center justify-center border border-secondary-500/30 dark:border-secondary-600/30 group-hover:bg-secondary-500/80 dark:group-hover:bg-secondary-600/60 transition-colors duration-300">
                                    <User size={16} className="text-white" />
                                </div>
                                <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                                <ChevronDown size={14} className="hidden md:block text-secondary-300 dark:text-neutral-500 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md rounded-2xl border border-secondary-100/30 dark:border-dark-border shadow-xl dark:shadow-dark-md z-50 overflow-hidden animate-fadeIn">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                                        <p className="font-medium text-gray-800 dark:text-neutral-200">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-neutral-400">{user.email}</p>
                                        <div className="mt-1.5 flex items-center">
                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="px-1 py-1">
                                        <NavLink to="/profile" className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300">
                                            <User size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                            <span>My Profile</span>
                                        </NavLink>
                                        <NavLink to="/settings" className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300">
                                            <Settings size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                            <span>Settings</span>
                                        </NavLink>
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-dark-border mt-1 px-1 py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-900/20 text-sm flex items-center text-red-600 dark:text-red-400"
                                        >
                                            <LogOut size={16} className="mr-3" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="xl:hidden p-2.5 rounded-xl hover:bg-secondary-600/40 dark:hover:bg-dark-hover transition-all duration-300 text-gray-800/70 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white ml-1"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="xl:hidden fixed inset-0 z-50 left-[60px] w-[calc(100%-60px)] bg-gradient-to-br from-secondary-900/98 via-primary-900/98 to-secondary-900/98 dark:from-charcoal-950/98 dark:via-dark-surface/98 dark:to-charcoal-950/98 backdrop-blur-xl">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="w-[150px] h-auto cursor-pointer"
                                    onClick={() => navigate('/')}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl bg-secondary-800/50 dark:bg-dark-hover hover:bg-secondary-700/60 dark:hover:bg-dark-active transition-all duration-200 text-gray-800"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <nav className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {filterSections(routes).map((item, idx) => (
                                <div key={idx} className="py-2">
                                    {item.type === 'section' && (
                                        <>
                                            <div className="flex items-center mb-4">
                                                <h3 className="text-xs font-bold text-secondary-300 dark:text-neutral-400 uppercase tracking-[0.15em]">
                                                    {item.title}
                                                </h3>
                                                <div className="flex-1 h-px bg-gradient-to-r from-secondary-500/30 dark:from-secondary-700/30 to-transparent ml-4"></div>
                                            </div>
                                            <div className="space-y-2">
                                                {filterItems(item.items).map((subItem, subIdx) => {
                                                    if (subItem.type === 'link') {
                                                        return (
                                                            <NavLink
                                                                key={subIdx}
                                                                to={subItem.path}
                                                                className={({ isActive }) => `
                                                                    flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                                                    ${isActive
                                                                        ? 'bg-secondary-700/50 dark:bg-dark-active border border-secondary-600/50 dark:border-dark-border'
                                                                        : 'hover:bg-secondary-800/50 dark:hover:bg-dark-hover'
                                                                    }
                                                                `}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subItem.icon && (
                                                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-800/80 dark:bg-dark-border group-hover:bg-secondary-700/80 dark:group-hover:bg-dark-hover transition-all duration-300 mr-4">
                                                                        <subItem.icon width={18} height={18} className="text-secondary-200 dark:text-secondary-300" />
                                                                    </div>
                                                                )}
                                                                <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{subItem.title}</span>
                                                            </NavLink>
                                                        );
                                                    } else if (subItem.type === 'dropdown') {
                                                        return renderNestedDropdown(subItem);
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="mt-8 pt-6 border-t border-secondary-800/50 dark:border-dark-border">
                            <div className="flex items-center p-4 rounded-2xl bg-secondary-800/30 dark:bg-dark-elevated border border-secondary-700/30 dark:border-dark-border">
                                <div className="w-12 h-12 rounded-xl bg-secondary-700/80 dark:bg-dark-active flex items-center justify-center mr-4">
                                    <User size={20} className="text-secondary-200 dark:text-secondary-300" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{user?.name}</div>
                                    <div className="text-xs text-secondary-300 dark:text-neutral-400">{user?.role}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl bg-secondary-700/50 dark:bg-dark-active hover:bg-secondary-600/60 dark:hover:bg-dark-hover transition-all duration-200 text-secondary-200 dark:text-secondary-300"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                /* Better styles for keyboard shortcuts */
                kbd {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default TopNavigation;