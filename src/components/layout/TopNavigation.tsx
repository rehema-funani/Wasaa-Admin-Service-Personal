import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, CircleDot } from 'lucide-react';
import Cookies from 'js-cookie';
import routes from '../../constants/routes';
import logo from '../../assets/images/logo-wasaa.png';
import { User as UserIcon, LogOut as LogOutIcon } from 'lucide-react';
import { hasPermissionForRoute } from '../../utils/permissions';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

interface TopNavigationProps {
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ toggleDarkMode, isDarkMode }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeNestedDropdown, setActiveNestedDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Refs
    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const navigate = useNavigate();
    const location = useLocation();

    // User data
    const user = Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null;
    const userPermissions = user?.permissions || [];

    // Effects
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown) {
                const ref = dropdownRefs.current[activeDropdown];
                if (ref && !ref.contains(event.target as Node)) {
                    setActiveDropdown(null);
                    setActiveNestedDropdown(null);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    // Close menus when route changes
    useEffect(() => {
        setActiveDropdown(null);
        setActiveNestedDropdown(null);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Handler functions
    const handleNestedDropdownToggle = (key: string) => {
        setActiveNestedDropdown(activeNestedDropdown === key ? null : key);
    };

    const handleLogout = () => {
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userData');
        navigate('/auth/login');
    };

    // Filter functions
    const filterItems = (items: any[]) => {
        return items.filter(item => {
            if (item.type === 'link') {
                return hasPermissionForRoute(item.path);
            } else if (item.type === 'dropdown') {
                const filteredDropdownItems = item.items.filter((subItem: any) =>
                    hasPermissionForRoute(subItem.path)
                );
                return filteredDropdownItems.length > 0;
            }
            return true;
        });
    };

    const filterSections = (sections: any[]) => {
        return sections.filter(section => {
            if (section.type !== 'section') return true;

            const filteredItems = filterItems(section.items);
            return filteredItems.length > 0;
        });
    };

    // Render functions
    const renderNestedDropdown = (dropdown: any) => {
        const isActive = activeNestedDropdown === dropdown.key;
        const filteredItems = dropdown.items.filter((item: any) =>
            hasPermissionForRoute(item.path)
        );

        if (filteredItems.length === 0) return null;

        return (
            <div key={dropdown.key} className="relative">
                <button
                    onClick={() => handleNestedDropdownToggle(dropdown.key)}
                    className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-secondary-100/90 to-primary-100/90 text-secondary-700 dark:from-secondary-800/60 dark:to-primary-800/60 dark:text-secondary-100 shadow-lg shadow-secondary-300/15 dark:shadow-secondary-900/25'
                        : 'hover:bg-gradient-to-r hover:from-secondary-50/90 hover:to-primary-50/90 dark:hover:from-dark-hover/90 dark:hover:to-dark-active/80'
                        } relative overflow-hidden`}
                >
                    {/* Add hover effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary-100/0 via-primary-100/0 to-secondary-100/0 dark:from-secondary-800/0 dark:via-primary-800/0 dark:to-secondary-800/0 group-hover:from-secondary-100/20 group-hover:via-primary-100/20 group-hover:to-secondary-100/20 dark:group-hover:from-secondary-800/10 dark:group-hover:via-primary-800/10 dark:group-hover:to-secondary-800/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl -z-10"></span>

                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 mr-4 ${isActive
                        ? 'bg-gradient-to-br from-secondary-200/90 to-primary-200/90 dark:from-secondary-700/70 dark:to-primary-700/70 shadow-lg shadow-secondary-300/20 dark:shadow-secondary-900/30 scale-110'
                        : 'bg-gradient-to-br from-slate-100/90 to-slate-50/90 group-hover:from-secondary-100/90 group-hover:to-primary-100/90 dark:from-dark-elevated/90 dark:to-dark-active/80 dark:group-hover:from-secondary-800/50 dark:group-hover:to-primary-800/50 shadow-md shadow-slate-300/10 dark:shadow-dark-border/20 hover:shadow-lg hover:shadow-secondary-300/15 dark:hover:shadow-secondary-900/25 hover:scale-105'
                        }`}>
                        <dropdown.icon size={18} className={`transition-all duration-300 ${isActive
                            ? 'text-secondary-700 dark:text-secondary-100 rotate-3'
                            : 'text-slate-600 dark:text-neutral-300 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 hover:rotate-3'
                            }`} />
                    </div>
                    <div className="flex-1 text-left">
                        <span className={`text-sm font-medium transition-colors duration-300 ${isActive
                            ? 'text-secondary-700 dark:text-secondary-100'
                            : 'text-slate-700 dark:text-neutral-200 group-hover:text-secondary-700 dark:group-hover:text-secondary-200'
                            }`}>
                            {dropdown.title}
                        </span>
                    </div>
                    <ChevronDown
                        size={14}
                        className={`transition-all duration-300 ${isActive
                            ? 'rotate-180 text-secondary-600 dark:text-secondary-200'
                            : 'text-slate-400 dark:text-neutral-400 group-hover:text-secondary-500 dark:group-hover:text-secondary-300'
                            }`}
                    />
                </button>

                {isActive && (
                    <div className="ml-4 mt-2 space-y-1 animate-slideDown pl-2 border-l border-secondary-200/30 dark:border-secondary-800/30">
                        {filteredItems.map((subItem: any, subIdx: number) => (
                            <NavLink
                                key={subIdx}
                                to={subItem.path}
                                className={({ isActive }) => `group flex items-center p-2.5 rounded-lg hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 
                                dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60
                                transition-all duration-300 transform hover:translate-x-1 relative overflow-hidden
                                ${isActive ? 'bg-white/70 dark:bg-dark-elevated/70 shadow-sm shadow-secondary-300/10 dark:shadow-dark-border/20' : ''}`}
                            >
                                {/* Hover background effect */}
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary-100/0 to-primary-100/0 dark:from-secondary-900/0 dark:to-primary-900/0 group-hover:from-secondary-100/20 group-hover:to-primary-100/20 dark:group-hover:from-secondary-900/10 dark:group-hover:to-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>

                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-dark-border group-hover:bg-secondary-400 dark:group-hover:bg-secondary-500 transition-all duration-300 mr-3 flex-shrink-0
                                navlink-active:bg-secondary-400 dark:navlink-active:bg-secondary-400 group-hover:scale-125"
                                ></div>
                                <span className="text-xs text-slate-600 dark:text-neutral-300 group-hover:text-secondary-600 dark:group-hover:text-secondary-200 transition-colors duration-300
                                navlink-active:text-secondary-700 dark:navlink-active:text-secondary-100"
                                >
                                    {subItem.title}
                                </span>
                                <ArrowRight size={12} className="text-slate-300 dark:text-neutral-500 group-hover:text-secondary-400 dark:group-hover:text-secondary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 ml-auto" />

                                {isActive && (
                                    <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-secondary-500 dark:bg-secondary-400 rounded-full"></span>
                                )}
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
            <div className="absolute top-full left-0 mt-2 bg-white/80 dark:bg-dark-elevated/80 backdrop-blur-2xl rounded-2xl shadow-2xl dark:shadow-dark-lg border border-white/30 dark:border-dark-border/50 overflow-hidden z-50 animate-slideDown min-w-[380px] max-w-[480px]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 to-white/70 dark:from-dark-elevated/90 dark:to-dark-surface/80 -z-10"></div>

                {/* Decorative background patterns */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 rounded-full blur-2xl -z-5 animate-blob"></div>
                <div className="absolute bottom-0 left-10 w-24 h-24 bg-gradient-to-br from-secondary-500/5 to-primary-500/5 dark:from-secondary-500/10 dark:to-primary-500/10 rounded-full blur-2xl -z-5 animate-blob animation-delay-2000"></div>

                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-5 relative">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-[0.12em] mb-1 flex items-center">
                            {section.title}
                            <span className="ml-2 inline-flex h-4 w-0.5 bg-gradient-to-b from-secondary-400 to-primary-400 dark:from-secondary-600 dark:to-primary-600 animate-pulse"></span>
                        </h3>
                        <div className="w-10 h-0.5 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full"></div>
                    </div>
                    <div className="space-y-1.5">
                        {filteredItems.map((item: any, idx: number) => {
                            if (item.type === 'link') {
                                return (
                                    <NavLink
                                        key={idx}
                                        to={item.path}
                                        className="group flex items-center p-3 rounded-xl 
                                        hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80 
                                        dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60
                                        transition-all duration-300 transform hover:translate-x-1 relative overflow-hidden"
                                    >
                                        {/* Hover fill effect */}
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary-100/0 via-primary-100/0 to-secondary-100/0 dark:from-secondary-800/0 dark:via-primary-800/0 dark:to-secondary-800/0 group-hover:from-secondary-100/20 group-hover:via-primary-100/20 group-hover:to-secondary-100/20 dark:group-hover:from-secondary-800/10 dark:group-hover:via-primary-800/10 dark:group-hover:to-secondary-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -z-10"></span>

                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl
                                        bg-gradient-to-br from-slate-100/90 to-slate-50/90 dark:from-dark-elevated/90 dark:to-dark-active/80 
                                        group-hover:from-secondary-100/90 group-hover:to-primary-100/90 
                                        dark:group-hover:from-secondary-800/50 dark:group-hover:to-primary-800/50
                                        group-[.active]:from-secondary-100/90 group-[.active]:to-primary-100/90 
                                        dark:group-[.active]:from-secondary-800/50 dark:group-[.active]:to-primary-800/50
                                        transition-all duration-300 mr-3 shadow-md shadow-slate-300/10 dark:shadow-dark-border/20 group-hover:shadow-lg dark:group-hover:shadow-dark-border/30 group-hover:scale-110"
                                        >
                                            <item.icon size={18} className="text-slate-600 dark:text-neutral-300 
                                            group-hover:text-secondary-600 dark:group-hover:text-secondary-300
                                            group-[.active]:text-secondary-600 dark:group-[.active]:text-secondary-300
                                            transition-all duration-300 group-hover:rotate-3" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-slate-700 dark:text-neutral-200 
                                            group-hover:text-secondary-700 dark:group-hover:text-secondary-200
                                            group-[.active]:text-secondary-700 dark:group-[.active]:text-secondary-200
                                            transition-colors duration-300 block">
                                                {item.title}
                                            </span>
                                            {item.description && (
                                                <span className="text-xs text-slate-500 dark:text-neutral-400 
                                                group-hover:text-secondary-500 dark:group-hover:text-secondary-400
                                                group-[.active]:text-secondary-500 dark:group-[.active]:text-secondary-400
                                                transition-colors duration-300 mt-0.5 block">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight size={14} className="text-slate-400 dark:text-neutral-500 group-hover:text-secondary-500 dark:group-hover:text-secondary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
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
            if (!hasPermissionForRoute(item.path)) {
                return null;
            }

            return (
                <NavLink
                    to={item.path}
                    className={({ isActive }) => `group flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 
                    ${isActive ?
                            'bg-gradient-to-r from-secondary-50/90 to-primary-50/90 dark:from-secondary-900/30 dark:to-primary-900/30 text-secondary-700 dark:text-secondary-100 shadow-md shadow-secondary-300/10 dark:shadow-secondary-900/20 scale-105' :
                            'text-slate-600 dark:text-neutral-200 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60 hover:scale-[1.03]'}`
                    }
                >
                    <item.icon size={16} className={`mr-2.5 transition-all duration-300 ${location.pathname === item.path ? 'text-secondary-600 dark:text-secondary-300 scale-110' : 'dark:text-neutral-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 group-hover:scale-110'}`} />
                    <span>{item.title}</span>
                    {location.pathname === item.path && (
                        <span className="ml-1.5 relative">
                            <span className="absolute top-0.5 right-0 w-1.5 h-1.5 rounded-full bg-secondary-500 dark:bg-secondary-400 animate-ping opacity-75"></span>
                            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-secondary-600 dark:bg-secondary-500"></span>
                        </span>
                    )}
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
                        className={`group flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 
                        ${activeDropdown === item.title
                                ? 'bg-gradient-to-r from-secondary-50/90 to-primary-50/90 dark:from-secondary-900/30 dark:to-primary-900/30 text-secondary-700 dark:text-secondary-100 shadow-md shadow-secondary-300/10 dark:shadow-secondary-900/20 scale-105'
                                : 'text-slate-600 dark:text-neutral-200 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60 hover:scale-[1.03]'
                            } relative overflow-hidden`}
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary-100/0 via-primary-100/0 to-secondary-100/0 dark:from-secondary-800/0 dark:via-primary-800/0 dark:to-secondary-800/0 group-hover:from-secondary-100/30 group-hover:via-primary-100/30 group-hover:to-secondary-100/30 dark:group-hover:from-secondary-800/10 dark:group-hover:via-primary-800/10 dark:group-hover:to-secondary-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl"></span>

                        <span className="relative z-10">{item.title}</span>
                        <ChevronDown
                            size={14}
                            className={`ml-2 transition-all duration-300 relative z-10 ${activeDropdown === item.title
                                ? 'rotate-180 text-secondary-600 dark:text-secondary-300'
                                : 'text-slate-400 dark:text-neutral-400 group-hover:text-secondary-500 dark:group-hover:text-secondary-300'
                                }`}
                        />
                    </button>
                    {activeDropdown === item.title && renderMegaMenu(item)}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed top-0 right-0 z-40 left-[60px] w-[calc(100%-60px)]">
            {/* Animated gradient background line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-500 bg-[length:200%_100%] animate-gradientFlow"></div>

            <div className={`transition-all duration-500 ${scrolled
                ? 'bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl shadow-lg shadow-secondary-900/10 dark:shadow-dark-lg border-b border-slate-200/50 dark:border-dark-border/40'
                : 'bg-white/70 dark:bg-dark-surface/70 backdrop-blur-lg'
                }`}>
                <div className="px-4 py-2 flex items-center justify-between relative">
                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

                    <div className="flex items-center mr-2 lg:mr-10 relative">
                        <div className="absolute -top-1 -right-1 w-3 h-3">
                            <Sparkles size={14} className="text-secondary-500 dark:text-secondary-400 animate-twinkle" />
                        </div>
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-[180px] h-auto cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:drop-shadow-lg"
                            onClick={() => navigate('/')}
                        />
                    </div>

                    <nav className="hidden xl:flex items-center flex-1 justify-center">
                        <div className="flex items-center space-x-1 bg-white/80 dark:bg-dark-elevated/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg shadow-primary-300/10 dark:shadow-dark-border/20 border border-white/40 dark:border-dark-border/30 hover:shadow-xl hover:shadow-primary-300/15 dark:hover:shadow-dark-border/30 transition-all duration-500">
                            {filterSections(routes).map((item: any, idx: number) => (
                                <div key={idx}>
                                    {renderNavItem(item)}
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-1 md:space-x-2">
                        <SearchBar userPermissions={userPermissions} />
                        <UserMenu user={user} onLogout={handleLogout} />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="xl:hidden p-2 rounded-xl hover:bg-secondary-50/80 dark:hover:bg-dark-hover/80 transition-all duration-300 text-gray-700 dark:text-neutral-300 hover:text-secondary-700 dark:hover:text-secondary-300 ml-1 border border-transparent hover:border-secondary-200/30 dark:hover:border-dark-border/50 active:scale-95"
                        >
                            <Menu size={18} className="hover:rotate-3 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="xl:hidden fixed inset-0 z-50 left-[60px] w-[calc(100%-60px)] bg-gradient-to-br from-white/95 via-secondary-50/95 to-primary-50/95 dark:from-dark-surface/95 dark:via-dark-elevated/95 dark:to-dark-surface/95 backdrop-blur-xl animate-fadeIn">
                    {/* Mobile menu decorative elements */}
                    <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-primary-500/5 to-secondary-500/10 dark:from-primary-500/10 dark:to-secondary-500/15 blur-3xl opacity-70 pointer-events-none"></div>
                    <div className="absolute bottom-[30%] right-[10%] w-48 h-48 rounded-full bg-gradient-to-tl from-secondary-500/5 to-primary-500/10 dark:from-secondary-500/10 dark:to-primary-500/15 blur-3xl opacity-70 pointer-events-none"></div>

                    <div className="p-5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="w-[150px] h-auto cursor-pointer"
                                    onClick={() => navigate('/')}
                                />
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-xl bg-white/80 dark:bg-dark-elevated/80 hover:bg-secondary-50/90 dark:hover:bg-dark-hover/90 transition-all duration-200 text-slate-600 dark:text-neutral-300 shadow-md shadow-secondary-300/10 dark:shadow-dark-border/20 border border-white/40 dark:border-dark-border/30 active:scale-95"
                            >
                                <X size={18} className="hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <nav className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto">
                            {filterSections(routes).map((item, idx) => (
                                <div key={idx} className="py-2">
                                    {item.type === 'section' && (
                                        <>
                                            <div className="flex items-center mb-3">
                                                <h3 className="text-xs font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-[0.12em]">
                                                    {item.title}
                                                </h3>
                                                <div className="flex-1 h-0.5 bg-gradient-to-r from-secondary-400/40 dark:from-secondary-600/40 to-transparent ml-3 rounded-full"></div>
                                            </div>
                                            <div className="space-y-1.5">
                                                {filterItems(item.items).map((subItem, subIdx) => {
                                                    if (subItem.type === 'link') {
                                                        return (
                                                            <NavLink
                                                                key={subIdx}
                                                                to={subItem.path}
                                                                className={({ isActive }) => `
                                                                flex items-center px-3 py-3 rounded-xl transition-all duration-300 group
                                                                ${isActive
                                                                        ? 'bg-white/80 dark:bg-dark-elevated/80 border border-secondary-200/50 dark:border-dark-border/50 shadow-md shadow-secondary-300/10 dark:shadow-dark-border/20'
                                                                        : 'hover:bg-white/60 dark:hover:bg-dark-hover/60 hover:translate-x-1'
                                                                    }
                                                                `}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subItem.icon && (
                                                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100/90 to-white/90 dark:from-dark-elevated/90 dark:to-dark-active/80 group-hover:from-secondary-100/90 group-hover:to-primary-100/90 dark:group-hover:from-secondary-900/30 dark:group-hover:to-primary-900/30 transition-all duration-300 mr-3 shadow-md shadow-slate-300/10 dark:shadow-dark-border/20 group-hover:shadow-lg group-hover:shadow-secondary-300/20 dark:group-hover:shadow-secondary-900/30">
                                                                        <subItem.icon size={16} className="text-slate-600 dark:text-neutral-300 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 group-hover:scale-110 transition-transform duration-300" />
                                                                    </div>
                                                                )}
                                                                <span className="text-sm font-medium text-slate-700 dark:text-neutral-200 group-hover:text-secondary-700 dark:group-hover:text-secondary-200">{subItem.title}</span>
                                                                {isActive && (
                                                                    <CircleDot size={14} className="ml-auto text-secondary-500 dark:text-secondary-400 animate-pulse" />
                                                                )}
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

                        <div className="mt-6 pt-5 border-t border-secondary-200/30 dark:border-dark-border/30">
                            <div className="flex items-center p-3 rounded-xl bg-white/80 dark:bg-dark-elevated/80 border border-secondary-200/40 dark:border-dark-border/40 shadow-md shadow-secondary-300/10 dark:shadow-dark-border/20 relative overflow-hidden group hover:shadow-lg hover:shadow-secondary-300/15 dark:hover:shadow-dark-border/30 transition-all duration-500">
                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary-100/0 via-primary-100/0 to-secondary-100/0 dark:from-secondary-900/0 dark:via-primary-900/0 dark:to-secondary-900/0 group-hover:from-secondary-100/30 group-hover:via-primary-100/30 group-hover:to-secondary-100/30 dark:group-hover:from-secondary-900/10 dark:group-hover:via-primary-900/10 dark:group-hover:to-secondary-900/10 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>

                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-100/90 to-primary-100/90 dark:from-secondary-900/30 dark:to-primary-900/30 flex items-center justify-center mr-3 shadow-md shadow-secondary-300/10 dark:shadow-secondary-900/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-100/0 to-primary-100/0 dark:from-secondary-800/0 dark:to-primary-800/0 group-hover:from-secondary-200/50 group-hover:to-primary-200/50 dark:group-hover:from-secondary-800/30 dark:group-hover:to-primary-800/30 rounded-lg transition-all duration-300"></div>
                                    <UserIcon size={16} className="text-secondary-600 dark:text-secondary-300 relative z-10" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-700 dark:text-neutral-200">{user?.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-neutral-400">{user?.role}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg bg-white/80 dark:bg-dark-elevated/80 hover:bg-secondary-50/90 dark:hover:bg-dark-hover/90 transition-all duration-200 text-slate-600 dark:text-neutral-300 border border-secondary-200/30 dark:border-dark-border/30 hover:border-secondary-300/50 dark:hover:border-secondary-800/50 active:scale-95 relative z-10"
                                >
                                    <LogOutIcon size={15} className="hover:rotate-12 transition-transform duration-300" />
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
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradientFlow {
                    animation: gradientFlow 8s ease infinite;
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }
                
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(20px, -10px) scale(1.1); }
                    66% { transform: translate(-10px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 15s infinite alternate;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.3);
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(75, 85, 99, 0.4);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(156, 163, 175, 0.5);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(75, 85, 99, 0.6);
                }
            `}</style>
        </div>
    );
};

export default TopNavigation;