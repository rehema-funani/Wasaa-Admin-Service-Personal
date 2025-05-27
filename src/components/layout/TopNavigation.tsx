import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronDown, Search, X, Bell,
    ArrowRight,
    Zap,
    Menu,
    User,
    Settings
} from 'lucide-react';
import routes from '../../constants/routes';

const TopNavigation: React.FC = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRefs = useRef({});

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
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    const handleNestedDropdownToggle = (key) => {
        setActiveNestedDropdown(activeNestedDropdown === key ? null : key);
    };

    const renderNestedDropdown = (dropdown) => {
        const isActive = activeNestedDropdown === dropdown.key;

        return (
            <div key={dropdown.key} className="relative">
                <button
                    onClick={() => handleNestedDropdownToggle(dropdown.key)}
                    className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-secondary-100/80 to-primary-100/80 text-secondary-700'
                        : 'hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80'
                        }`}
                >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 mr-4 shadow-sm ${isActive
                        ? 'bg-gradient-to-br from-secondary-200 to-primary-200'
                        : 'bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-secondary-100 group-hover:to-primary-100'
                        }`}>
                        <dropdown.icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-secondary-700' : 'text-slate-600 group-hover:text-secondary-600'
                            }`} />
                    </div>
                    <div className="flex-1 text-left">
                        <span className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-secondary-700' : 'text-slate-700 group-hover:text-secondary-700'
                            }`}>
                            {dropdown.title}
                        </span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`transition-all duration-300 ${isActive
                            ? 'rotate-180 text-secondary-600'
                            : 'text-slate-400 group-hover:text-secondary-500'
                            }`}
                    />
                </button>

                {isActive && (
                    <div className="ml-4 mt-2 space-y-1 animate-fadeIn">
                        {dropdown.items.map((subItem, subIdx) => (
                            <a
                                key={subIdx}
                                href={subItem.path}
                                className="group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-secondary-50/60 hover:to-primary-50/60 transition-all duration-300 transform hover:translate-x-1"
                            >
                                <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-secondary-400 transition-colors duration-300 mr-4 flex-shrink-0"></div>
                                <span className="text-sm text-slate-600 group-hover:text-secondary-600 transition-colors duration-300">
                                    {subItem.title}
                                </span>
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-secondary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 ml-auto" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderMegaMenu = (section: any) => {
        return (
            <div className="absolute top-full left-0 mt-3 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-fadeIn min-w-[400px] max-w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/40 -z-10"></div>
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">{section.title}</h3>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        {section.items.map((item: any, idx: any) => {
                            if (item.type === 'link') {
                                return (
                                    <a
                                        key={idx}
                                        href={item.path}
                                        className="group flex items-center p-4 rounded-2xl hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80 transition-all duration-300 transform hover:translate-x-1"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-secondary-100 group-hover:to-primary-100 transition-all duration-300 mr-4 shadow-sm group-hover:shadow-md">
                                            <item.icon size={20} className="text-slate-600 group-hover:text-secondary-600 transition-colors duration-300" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-semibold text-slate-700 group-hover:text-secondary-700 transition-colors duration-300 block">
                                                {item.title}
                                            </span>
                                            {item.description && (
                                                <span className="text-xs text-slate-500 group-hover:text-secondary-500 transition-colors duration-300 mt-1 block">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight size={16} className="text-slate-400 group-hover:text-secondary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                                    </a>
                                );
                            } else if (item.type === 'dropdown') {
                                return renderNestedDropdown(item);
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderNavItem = (item: any) => {
        if (item.type === 'link') {
            return (
                <a
                    href={item.path}
                    className="group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:text-secondary-700 hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-primary-50/50 transition-all duration-300 transform hover:scale-105"
                >
                    <item.icon size={18} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.title}</span>
                </a>
            );
        } else if (item.type === 'section') {
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
                        className={`group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${activeDropdown === item.title
                            ? 'text-secondary-700 bg-gradient-to-r from-secondary-50 to-primary-50 shadow-sm'
                            : 'text-slate-600 hover:text-secondary-700 hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-primary-50/50'
                            }`}
                    >
                        <span>{item.title}</span>
                        <ChevronDown
                            size={16}
                            className={`ml-2 transition-all duration-300 ${activeDropdown === item.title
                                ? 'rotate-180 text-secondary-600'
                                : 'text-slate-400 group-hover:text-secondary-500'
                                }`}
                        />
                    </button>
                    {activeDropdown === item.title && renderMegaMenu(item)}
                </div>
            );
        }
    };

    return (
        <div className="fixed top-0 left-20 right-0 z-40">
            <div className={`transition-all duration-500 ${scrolled
                ? 'bg-primary-300 backdrop-blur-3xl border-b border-slate-200/50 shadow-xl shadow-slate-900/5'
                : 'bg-white/95 backdrop-blur-2xl border-b border-slate-100/50'
                }`}>
                <div className="px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center mr-12">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-600 via-primary-600 to-secondary-700 flex items-center justify-center shadow-lg shadow-secondary-500/25 transform hover:scale-110 transition-all duration-300">
                                <Zap size={24} className="text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-2xl opacity-30 blur animate-pulse"></div>
                        </div>
                    </div>

                    <nav className="hidden xl:flex items-center flex-1 justify-center">
                        <div className="flex items-center space-x-2 bg-slate-50/50 rounded-3xl p-2 shadow-inner">
                            {routes.map((item: any, idx: any) => (
                                <div key={idx}>
                                    {renderNavItem(item)}
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {isSearchOpen ? (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search anything..."
                                            className="w-80 pl-5 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:border-secondary-400 focus:outline-none focus:ring-4 focus:ring-secondary-100 transition-all duration-300 text-sm font-medium bg-white/90 backdrop-blur-sm shadow-lg"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => setIsSearchOpen(false)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                                        >
                                            <X size={16} className="text-slate-500" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-3 rounded-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-110 group"
                                >
                                    <Search size={20} className="text-slate-600 group-hover:text-secondary-600 transition-colors duration-300" />
                                </button>
                            )}
                        </div>

                        <button className="relative p-3 rounded-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-110 group">
                            <Bell size={20} className="text-slate-600 group-hover:text-secondary-600 transition-colors duration-300" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></span>
                        </button>

                        <div className="hidden lg:flex items-center ml-4">
                            <button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100 transition-all duration-300 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <User size={18} className="text-secondary-600" />
                                </div>
                                <ChevronDown size={14} className="text-slate-400 group-hover:text-secondary-500 transition-colors duration-300" />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="xl:hidden p-3 rounded-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-110"
                        >
                            <Menu size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="xl:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-600 to-primary-600 flex items-center justify-center mr-3">
                                    <Zap size={20} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Menu</h2>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200"
                            >
                                <X size={22} className="text-slate-600" />
                            </button>
                        </div>

                        <nav className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {routes.map((item, idx) => (
                                <div key={idx} className="py-2">
                                    {item.type === 'section' && (
                                        <>
                                            <div className="flex items-center mb-4">
                                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">
                                                    {item.title}
                                                </h3>
                                                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
                                            </div>
                                            <div className="space-y-1">
                                                {item.items.map((subItem, subIdx) => {
                                                    if (subItem.type === 'link') {
                                                        return (
                                                            <a
                                                                key={subIdx}
                                                                href={subItem.path}
                                                                className="flex items-center px-5 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-secondary-50 hover:to-primary-50 transition-all duration-300 group"
                                                            >
                                                                {subItem.icon && (
                                                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-secondary-100 group-hover:to-primary-100 transition-all duration-300 mr-4">
                                                                        <subItem.icon width={18} height={18} className="text-slate-600 group-hover:text-secondary-600 transition-colors duration-300" />
                                                                    </div>
                                                                )}
                                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-secondary-700 transition-colors duration-300">{subItem.title}</span>
                                                            </a>
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

                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-secondary-50 to-primary-50">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center mr-4">
                                    <User size={20} className="text-secondary-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-700">John Doe</div>
                                    <div className="text-xs text-slate-500">Premium Member</div>
                                </div>
                                <Settings size={18} className="text-slate-400" />
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