import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
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
                        {filteredItems.map((subItem: any, subIdx: number) => (
                            <NavLink
                                key={subIdx}
                                to={subItem.path}
                                className="group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-secondary-50/60 hover:to-primary-50/60 
                  dark:hover:from-dark-hover dark:hover:to-dark-active/50
                  transition-all duration-300 transform hover:translate-x-1"
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
                        {filteredItems.map((item: any, idx: number) => {
                            if (item.type === 'link') {
                                return (
                                    <NavLink
                                        key={idx}
                                        to={item.path}
                                        className="group flex items-center p-4 rounded-2xl 
                      hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80 
                      dark:hover:from-dark-hover dark:hover:to-dark-active/70
                      transition-all duration-300 transform hover:translate-x-1"
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
            if (!hasPermissionForRoute(item.path)) {
                return null;
            }

            return (
                <NavLink
                    to={item.path}
                    className="group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105
            text-slate-600 dark:text-neutral-300 hover:text-secondary-700 dark:hover:text-secondary-400 
            hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-primary-50/50 
            dark:hover:from-dark-hover dark:hover:to-dark-active/70"
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
                            {filterSections(routes).map((item: any, idx: number) => (
                                <div key={idx}>
                                    {renderNavItem(item)}
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-1 md:space-x-3">
                        <SearchBar userPermissions={userPermissions} />
                        <UserMenu user={user} onLogout={handleLogout} />
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
                                    <UserIcon size={20} className="text-secondary-200 dark:text-secondary-300" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{user?.name}</div>
                                    <div className="text-xs text-secondary-300 dark:text-neutral-400">{user?.role}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl bg-secondary-700/50 dark:bg-dark-active hover:bg-secondary-600/60 dark:hover:bg-dark-hover transition-all duration-200 text-secondary-200 dark:text-secondary-300"
                                >
                                    <LogOutIcon size={16} />
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
      `}</style>
        </div>
    );
};

export default TopNavigation;