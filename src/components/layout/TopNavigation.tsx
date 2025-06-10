import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, MoreHorizontal, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
import routes from '../../constants/routes';
import logo from '../../assets/images/logo-wasaa.png';
import { User as UserIcon, LogOut as LogOutIcon, Settings } from 'lucide-react';
import { hasPermissionForRoute } from '../../utils/permissions';
import SearchBar from './SearchBar';

const TopNavigation = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [visibleItems, setVisibleItems] = useState([]);
    const [overflowItems, setOverflowItems] = useState([]);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const dropdownRefs = useRef({});
    const navContainerRef = useRef(null);
    const navItemsRef = useRef({});
    const overflowButtonRef = useRef(null);
    const userMenuRef = useRef(null);
    const hoverTimeouts = useRef<{ [key: string]: number | undefined }>({});
    const nestedDropdownRefs = useRef({});

    const navigate = useNavigate();
    const location = useLocation();

    const user = Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null;
    const userPermissions = user?.permissions || [];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const updateVisibleItems = useCallback(() => {
        if (!navContainerRef.current) return;

        const navContainer = navContainerRef.current;
        const containerWidth = navContainer.clientWidth;
        const filteredSections = filterSections(routes);

        const availableWidth = containerWidth - 100;

        let currentWidth = 0;
        const visible = [];
        const overflow = [];

        filteredSections.forEach((item, index) => {
            const itemRef = navItemsRef.current[`nav-item-${index}`];
            const itemWidth = itemRef ? itemRef.offsetWidth : 120;

            if (currentWidth + itemWidth < availableWidth) {
                visible.push(item);
                currentWidth += itemWidth;
            } else {
                overflow.push(item);
            }
        });

        setVisibleItems(visible);
        setOverflowItems(overflow);
    }, []);

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            if (navContainerRef.current) {
                updateVisibleItems();
            }
        }, 300);

        const handleResize = () => updateVisibleItems();
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(initialTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, [updateVisibleItems]);

    useEffect(() => {
        setActiveDropdown(null);
        setActiveNestedDropdown(null);
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (activeDropdown) {
                const ref = dropdownRefs.current[activeDropdown];
                const isClickInsideDropdown = ref && ref.contains(event.target);
                const isClickOnMegaMenu = document.querySelector('.mega-menu-container')?.contains(event.target);
                const isClickOnNestedMenu = document.querySelector('.nested-dropdown-menu')?.contains(event.target);

                if (!isClickInsideDropdown && !isClickOnMegaMenu && !isClickOnNestedMenu) {
                    setActiveDropdown(null);
                    setActiveNestedDropdown(null);
                }
            }

            if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown, isUserMenuOpen]);

    const handleDropdownHover = (title: any, e: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        clearTimeout(hoverTimeouts.current.close);

        if (activeDropdown !== title) {
            Object.values(hoverTimeouts.current).forEach(timeout =>
                clearTimeout(timeout as number)
            );

            hoverTimeouts.current[title] = setTimeout(() => {
                setActiveDropdown(title);
                setActiveNestedDropdown(null);
            }, 150);
        }
    };

    const handleDropdownLeave = (e: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        hoverTimeouts.current.close = setTimeout(() => {
            setActiveDropdown(null);
            setActiveNestedDropdown(null);
        }, 400);
    };

    const handleNestedDropdownHover = (key, e?) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        clearTimeout(hoverTimeouts.current.close);
        if (activeNestedDropdown !== key) {
            clearTimeout(hoverTimeouts.current[key]);

            hoverTimeouts.current[key] = setTimeout(() => {
                setActiveNestedDropdown(key);
            }, 150);
        }
    };

    const handleOverflowToggle = (e: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setActiveDropdown(activeDropdown === 'overflow' ? null : 'overflow');
    };

    const handleLogout = (e: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userData');
        navigate('/auth/login');
    };

    const filterItems = (items: any) => {
        return items.filter(item => {
            if (item.type === 'link') {
                return hasPermissionForRoute(item.path);
            } else if (item.type === 'dropdown') {
                const filteredDropdownItems = item.items.filter(subItem =>
                    hasPermissionForRoute(subItem.path)
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

    const calculateMenuPosition = (parentRef: any) => {
        if (!parentRef) return { position: 'right', style: {} };

        const parentRect = parentRef.getBoundingClientRect();
        const menuWidth = 240;
        const windowWidth = window.innerWidth;
        const spaceOnRight = windowWidth - parentRect.right;

        if (spaceOnRight < menuWidth + 20) {
            return {
                position: 'left',
                style: {
                    position: 'fixed' as React.CSSProperties['position'],
                    right: `${windowWidth - parentRect.left + 10}px`,
                    left: 'auto',
                    top: `${parentRect.top}px`,
                    opacity: 1,
                    transform: 'translateX(0)',
                }
            };
        } else {
            return {
                position: 'right',
                style: {
                    position: 'fixed' as React.CSSProperties['position'],
                    left: `${parentRect.right + 10}px`,
                    right: 'auto',
                    top: `${parentRect.top}px`,
                    opacity: 1,
                    transform: 'translateX(0)',
                }
            };
        }
    };

    const SmartPositionedNestedMenu = ({ parentRef, filteredItems, onItemClick, onMouseEnter, onMouseLeave }) => {
        const { style } = useMemo(() => calculateMenuPosition(parentRef), [parentRef]);

        if (!parentRef) return null;

        return (
            <div
                className="nested-dropdown-menu bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-2xl rounded-2xl shadow-2xl dark:shadow-dark-lg border border-white/30 dark:border-dark-border/50 overflow-hidden menu-transition"
                style={{
                    ...style,
                    zIndex: 1000,
                    minWidth: '220px',
                    maxWidth: '320px',
                }}
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    if (onMouseEnter) onMouseEnter(e);
                }}
                onMouseLeave={(e) => {
                    const relatedTarget = e.relatedTarget;
                    if (!e.currentTarget.contains(relatedTarget as Node) && parentRef !== relatedTarget && !parentRef?.contains(relatedTarget)) {
                        if (onMouseLeave) onMouseLeave(e);
                    }
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-3 space-y-1">
                    {filteredItems.map((subItem: any, subIdx: any) => (
                        <NavLink
                            key={subIdx}
                            to={subItem.path}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onItemClick) onItemClick();
                            }}
                            className={({ isActive }) => `
                                group flex items-center p-2.5 rounded-lg transition-all duration-200
                                ${isActive
                                    ? 'bg-white/70 dark:bg-dark-elevated/70'
                                    : 'hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60'
                                }
                            `}
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-dark-border mr-3 flex-shrink-0 transition-all duration-200"></div>
                            <span className="text-xs text-slate-600 dark:text-neutral-300 transition-colors duration-200">
                                {subItem.title}
                            </span>
                            <ArrowRight
                                size={12}
                                className="text-slate-300 dark:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto"
                            />
                        </NavLink>
                    ))}
                </div>
            </div>
        );
    };      

    const renderNestedDropdown = (dropdown: any, isInMegaMenu = false) => {
        const isActive = activeNestedDropdown === dropdown.key;
        const filteredItems = dropdown.items.filter(item =>
            hasPermissionForRoute(item.path)
        );
        const refKey = `nested-${dropdown.key}`;

        if (filteredItems.length === 0) return null;

        const handleMenuMouseEnter = (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(hoverTimeouts.current.close);
            clearTimeout(hoverTimeouts.current[dropdown.key]);
            setActiveNestedDropdown(dropdown.key);
        };

        return (
            <div
                key={dropdown.key}
                className="relative"
                onMouseEnter={(e) => handleNestedDropdownHover(dropdown.key, e)}
                ref={(el) => {
                    nestedDropdownRefs.current[refKey] = el;
                }}
            >
                <div
                    className={`
                        flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 z-99
                        ${isActive
                            ? 'bg-gradient-to-r from-secondary-100/90 to-primary-100/90 text-secondary-700 dark:from-secondary-800/60 dark:to-primary-800/60 dark:text-secondary-100'
                            : 'hover:bg-gradient-to-r hover:from-secondary-50/90 hover:to-primary-50/90 dark:hover:from-dark-hover/90 dark:hover:to-dark-active/80'
                        }
                    `}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveNestedDropdown(isActive ? null : dropdown.key);
                    }}
                >
                    <div className={`
                        flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200
                        ${isActive
                            ? 'bg-gradient-to-br from-secondary-200/90 to-primary-200/90 dark:from-secondary-700/70 dark:to-primary-700/70 scale-110'
                            : 'bg-gradient-to-br from-slate-100/90 to-slate-50/90 group-hover:from-secondary-100/90 group-hover:to-primary-100/90 dark:from-dark-elevated/90 dark:to-dark-active/80'
                        }
                    `}>
                        <dropdown.icon
                            size={18}
                            className={`
                                transition-all duration-200
                                ${isActive
                                    ? 'text-secondary-700 dark:text-secondary-100'
                                    : 'text-slate-600 dark:text-neutral-300'
                                }
                            `}
                        />
                    </div>
                    <div className="flex-1 text-left">
                        <span className={`
                            text-sm font-medium
                            ${isActive
                                ? 'text-secondary-700 dark:text-secondary-100'
                                : 'text-slate-700 dark:text-neutral-200'
                            }
                        `}>
                            {dropdown.title}
                        </span>
                    </div>
                    {isInMegaMenu ? (
                        <ChevronRight
                            size={14}
                            className={`
                                transition-all duration-200
                                ${isActive
                                    ? 'text-secondary-600 dark:text-secondary-200'
                                    : 'text-slate-400 dark:text-neutral-400'
                                }
                            `}
                        />
                    ) : (
                        <ChevronDown
                            size={14}
                            className={`
                                transition-all duration-200
                                ${isActive
                                    ? 'rotate-180 text-secondary-600 dark:text-secondary-200'
                                    : 'text-slate-400 dark:text-neutral-400'
                                }
                            `}
                        />
                    )}
                </div>

                {isActive && (
                    isInMegaMenu ? (
                        ReactDOM.createPortal(
                            <SmartPositionedNestedMenu
                                key={`nested-menu-${dropdown.key}`}
                                parentRef={nestedDropdownRefs.current[refKey]}
                                filteredItems={filteredItems}
                                onItemClick={() => {
                                    setActiveNestedDropdown(null);
                                    setActiveDropdown(null);
                                }}
                                onMouseEnter={handleMenuMouseEnter}
                                onMouseLeave={(e: any) => handleDropdownLeave(e)}
                            />,
                            document.body
                        )
                    ) : (
                        <div className="ml-4 mt-2 space-y-1 animate-slideDown pl-2 border-l border-secondary-200/30 dark:border-secondary-800/30">
                            {filteredItems.map((subItem, subIdx) => (
                                <NavLink
                                    key={subIdx}
                                    to={subItem.path}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveNestedDropdown(null);
                                        setActiveDropdown(null);
                                    }}
                                    className={({ isActive }) => `
                                        group flex items-center p-2.5 rounded-lg transition-all duration-200
                                        ${isActive
                                            ? 'bg-white/70 dark:bg-dark-elevated/70'
                                            : 'hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60'
                                        }
                                    `}
                                >
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-dark-border mr-3 flex-shrink-0 transition-all duration-200"></div>
                                    <span className="text-xs text-slate-600 dark:text-neutral-300 transition-colors duration-200">
                                        {subItem.title}
                                    </span>
                                    <ArrowRight
                                        size={12}
                                        className="text-slate-300 dark:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto"
                                    />
                                </NavLink>
                            ))}
                        </div>
                    )
                )}
            </div>
        );
    };

    const renderMegaMenu = (section: any) => {
        const filteredItems = filterItems(section.items);
        if (filteredItems.length === 0) return null;

        return ReactDOM.createPortal(
            <div
                className="mega-menu-container fixed z-[999] bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-2xl rounded-2xl shadow-2xl dark:shadow-dark-lg border border-white/30 dark:border-dark-border/50 overflow-hidden animate-fadeIn"
                style={{
                    top: dropdownRefs.current[section.title]?.getBoundingClientRect().bottom + 5 || '64px',
                    left: dropdownRefs.current[section.title]?.getBoundingClientRect().left || '0',
                    width: '480px',
                }}
                onMouseEnter={(e) => {
                    e.preventDefault();
                    clearTimeout(hoverTimeouts.current.close);
                }}
                onMouseLeave={(e) => handleDropdownLeave(e)}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                            {section.title}
                        </h3>
                        <div className="w-10 h-0.5 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                        {filteredItems.map((item: any, idx: any) => {
                            if (item.type === 'link') {
                                return (
                                    <NavLink
                                        key={idx}
                                        to={item.path}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveNestedDropdown(null);
                                            setActiveDropdown(null);
                                        }}
                                        className="group flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-secondary-50/80 hover:to-primary-50/80 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-3 transition-all duration-200 bg-gradient-to-br from-slate-100/90 to-slate-50/90 dark:from-dark-elevated/90 dark:to-dark-active/80 group-hover:from-secondary-100/90 group-hover:to-primary-100/90 dark:group-hover:from-secondary-800/50 dark:group-hover:to-primary-800/50 group-hover:scale-110">
                                            <item.icon
                                                size={18}
                                                className="text-slate-600 dark:text-neutral-300 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-slate-700 dark:text-neutral-200 group-hover:text-secondary-700 dark:group-hover:text-secondary-200 transition-colors duration-200">
                                                {item.title}
                                            </span>
                                            {item.description && (
                                                <span className="text-xs text-slate-500 dark:text-neutral-400 group-hover:text-secondary-500 dark:group-hover:text-secondary-400 transition-colors duration-200 block mt-0.5">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight
                                            size={14}
                                            className="text-slate-400 dark:text-neutral-500 group-hover:text-secondary-500 dark:group-hover:text-secondary-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1"
                                        />
                                    </NavLink>
                                );
                            } else if (item.type === 'dropdown') {
                                return renderNestedDropdown(item, true);
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    const renderNavItem = (item: any, index: any, isInOverflow = false) => {
        if (item.type === 'link') {
            if (!hasPermissionForRoute(item.path)) {
                return null;
            }

            return (
                <NavLink
                    to={item.path}
                    ref={el => { if (!isInOverflow) navItemsRef.current[`nav-item-${index}`] = el; }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isInOverflow) {
                            setActiveDropdown(null);
                        }
                    }}
                    className={({ isActive }) => `
                        group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                        ${isActive
                            ? 'bg-gradient-to-r from-secondary-50/90 to-primary-50/90 dark:from-secondary-900/30 dark:to-primary-900/30 text-secondary-700 dark:text-secondary-100'
                            : 'text-slate-600 dark:text-neutral-200 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60'
                        }
                    `}
                >
                    <item.icon
                        size={16}
                        className={`
                            mr-2.5 transition-all duration-200
                            ${location.pathname === item.path
                                ? 'text-secondary-600 dark:text-secondary-300 scale-110'
                                : 'dark:text-neutral-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 group-hover:scale-110'
                            }
                        `}
                    />
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
            if (filteredItems.length === 0) return null;

            const isActive = activeDropdown === item.title;

            return (
                <div
                    className="relative"
                    ref={(el) => {
                        dropdownRefs.current[item.title] = el;
                        if (!isInOverflow) navItemsRef.current[`nav-item-${index}`] = el;
                    }}
                    onMouseEnter={(e) => handleDropdownHover(item.title, e)}
                    onMouseLeave={(e) => handleDropdownLeave(e)}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === item.title ? null : item.title);
                        }}
                        className={`
                            group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                            ${isActive
                                ? 'bg-gradient-to-r from-secondary-50/90 to-primary-50/90 dark:from-secondary-900/30 dark:to-primary-900/30 text-secondary-700 dark:text-secondary-100'
                                : 'text-slate-600 dark:text-neutral-200 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60'
                            }
                        `}
                    >
                        <span>{item.title}</span>
                        <ChevronDown
                            size={14}
                            className={`
                                ml-2 transition-all duration-200
                                ${isActive
                                    ? 'rotate-180 text-secondary-600 dark:text-secondary-300'
                                    : 'text-slate-400 dark:text-neutral-400 group-hover:text-secondary-500 dark:group-hover:text-secondary-300'
                                }
                            `}
                        />
                    </button>
                    {isActive && renderMegaMenu(item)}
                </div>
            );
        }
        return null;
    };

    const renderOverflowMenu = () => {
        if (overflowItems.length === 0) return null;

        return (
            <div className="relative">
                <button
                    ref={overflowButtonRef}
                    type="button"
                    onClick={(e) => handleOverflowToggle(e)}
                    className={`
                        flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                        ${activeDropdown === 'overflow'
                            ? 'bg-gradient-to-r from-secondary-50/90 to-primary-50/90 dark:from-secondary-900/30 dark:to-primary-900/30 text-secondary-700 dark:text-secondary-100'
                            : 'text-slate-600 dark:text-neutral-200 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-primary-50/70 dark:hover:from-dark-hover/80 dark:hover:to-dark-active/60'
                        }
                    `}
                >
                    <MoreHorizontal size={16} className="mr-1.5 text-slate-600 dark:text-neutral-300" />
                    <span>More</span>
                    <ChevronDown
                        size={14}
                        className={`
                            ml-1 transition-all duration-200
                            ${activeDropdown === 'overflow'
                                ? 'rotate-180 text-secondary-600 dark:text-secondary-300'
                                : 'text-slate-400 dark:text-neutral-400'
                            }
                        `}
                    />
                </button>

                {activeDropdown === 'overflow' && ReactDOM.createPortal(
                    <div
                        className="overflow-menu-container fixed z-[999] bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-2xl rounded-2xl shadow-2xl dark:shadow-dark-lg border border-white/30 dark:border-dark-border/50 overflow-hidden animate-fadeIn min-w-[280px] max-w-[400px]"
                        style={{
                            top: overflowButtonRef.current?.getBoundingClientRect().bottom + 10 || 75,
                            right: 20,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-3 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {overflowItems.map((item, idx) => (
                                <div key={idx} className="py-1">
                                    {renderNavItem(item, idx + 100, true)}
                                </div>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        );
    };

    const renderMobileMenu = () => {
        return (
            <div
                className="xl:hidden fixed inset-0 z-50 left-[60px] w-[calc(100%-60px)] bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5">
                    <div className="flex items-center justify-between mb-6">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-[150px] h-auto cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/');
                            }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsMobileMenuOpen(false);
                            }}
                            className="p-2 rounded-xl bg-white/80 dark:bg-dark-elevated/80 hover:bg-secondary-50/90 dark:hover:bg-dark-hover/90 transition-all duration-200 text-slate-600 dark:text-neutral-300"
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
                                            <h3 className="text-xs font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
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
                                                                flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                                                                ${isActive
                                                                    ? 'bg-white/80 dark:bg-dark-elevated/80 border border-secondary-200/50 dark:border-dark-border/50'
                                                                    : 'hover:bg-white/60 dark:hover:bg-dark-hover/60 hover:translate-x-1'
                                                                }
                                                            `}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsMobileMenuOpen(false);
                                                            }}
                                                        >
                                                            {subItem.icon && (
                                                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100/90 to-white/90 dark:from-dark-elevated/90 dark:to-dark-active/80 transition-all duration-200 mr-3 group-hover:from-secondary-100/90 group-hover:to-primary-100/90 dark:group-hover:from-secondary-900/30 dark:group-hover:to-primary-900/30">
                                                                    <subItem.icon
                                                                        size={16}
                                                                        className="text-slate-600 dark:text-neutral-300 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 transition-all duration-200"
                                                                    />
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-medium text-slate-700 dark:text-neutral-200 group-hover:text-secondary-700 dark:group-hover:text-secondary-200">
                                                                {subItem.title}
                                                            </span>
                                                        </NavLink>
                                                    );
                                                } else if (subItem.type === 'dropdown') {
                                                    return renderNestedDropdown(subItem, false);
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
                        <div className="flex items-center p-3 rounded-xl bg-white/80 dark:bg-dark-elevated/80 border border-secondary-200/40 dark:border-dark-border/40 transition-all duration-200">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-100/90 to-primary-100/90 dark:from-secondary-900/30 dark:to-primary-900/30 flex items-center justify-center mr-3">
                                <UserIcon size={16} className="text-secondary-600 dark:text-secondary-300" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-700 dark:text-neutral-200">{user?.name}</div>
                                <div className="text-xs text-slate-500 dark:text-neutral-400">{user?.role}</div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => handleLogout(e)}
                                className="p-2 rounded-lg bg-white/80 dark:bg-dark-elevated/80 hover:bg-secondary-50/90 dark:hover:bg-dark-hover/90 transition-all duration-200 text-slate-600 dark:text-neutral-300 border border-secondary-200/30 dark:border-dark-border/30 active:scale-95"
                            >
                                <LogOutIcon size={15} className="hover:rotate-12 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUserMenu = () => {
        return (
            <div className="relative" ref={userMenuRef}>
                <button
                    type="button"
                    className="flex items-center space-x-2 py-1.5 px-2 rounded-xl transition-all duration-200 hover:bg-secondary-50 dark:hover:bg-dark-hover text-gray-800 dark:text-neutral-300 group"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                >
                    <div className="w-8 h-8 rounded-xl bg-secondary-600/60 dark:bg-secondary-700/40 flex items-center justify-center">
                        <UserIcon size={16} className="text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                        {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`hidden md:block transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isUserMenuOpen && (
                    <div
                        className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md rounded-2xl border border-secondary-100/30 dark:border-dark-border shadow-xl dark:shadow-dark-md z-50 overflow-hidden animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                            <p className="font-medium text-gray-800 dark:text-neutral-200">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">{user?.email}</p>
                            <div className="mt-1.5">
                                <span className="text-[10px] font-medium px-2 py-0.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full">
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        <div className="px-1 py-1">
                            <NavLink
                                to="/profile"
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsUserMenuOpen(false);
                                }}
                            >
                                <UserIcon size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                <span>My Profile</span>
                            </NavLink>
                            <NavLink
                                to="/settings"
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-dark-hover text-sm flex items-center text-gray-700 dark:text-neutral-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsUserMenuOpen(false);
                                }}
                            >
                                <Settings size={16} className="mr-3 text-gray-500 dark:text-neutral-400" />
                                <span>Settings</span>
                            </NavLink>
                        </div>

                        <div className="border-t border-gray-100 dark:border-dark-border mt-1 px-1 py-1">
                            <button
                                type="button"
                                onClick={(e) => handleLogout(e)}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-900/20 text-sm flex items-center text-red-600 dark:text-red-400"
                            >
                                <LogOutIcon size={16} className="mr-3" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed top-0 right-0 z-40 left-[60px] w-[calc(100%-60px)]">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-500 bg-[length:200%_100%] animate-gradientFlow"></div>

            <div className={`transition-all duration-300 ${scrolled
                ? 'bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl shadow-lg shadow-secondary-900/10 dark:shadow-dark-lg border-b border-slate-200/50 dark:border-dark-border/40'
                : 'bg-white/70 dark:bg-dark-surface/70 backdrop-blur-lg'
                }`}>
                <div className="px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0 w-[180px] mr-4">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-auto cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate('/');
                                }}
                            />
                        </div>

                        <nav className="hidden xl:flex flex-1 items-center" ref={navContainerRef}>
                            <div className="flex items-center space-x-1 bg-white/80 dark:bg-dark-elevated/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg shadow-primary-300/10 dark:shadow-dark-border/20 border border-white/40 dark:border-dark-border/30 transition-all duration-300">
                                {visibleItems.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0">
                                        {renderNavItem(item, idx)}
                                    </div>
                                ))}
                                {overflowItems.length > 0 && renderOverflowMenu()}
                            </div>
                        </nav>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <SearchBar userPermissions={userPermissions} />
                            {renderUserMenu()}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsMobileMenuOpen(!isMobileMenuOpen);
                                }}
                                className="xl:hidden p-2 rounded-xl hover:bg-secondary-50/80 dark:hover:bg-dark-hover/80 transition-all duration-200 text-gray-700 dark:text-neutral-300 hover:text-secondary-700 dark:hover:text-secondary-300 ml-1"
                            >
                                <Menu size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && renderMobileMenu()}

            <style>{`

            .menu-transition {
                transition: transform 0.2s ease-out, opacity 0.2s ease-out;
                will-change: transform, opacity;
                }

                .nested-dropdown-menu {
                opacity: 0;
                animation: fadeInSmooth 0.2s ease-out forwards;
                }

                @keyframes fadeInSmooth {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.25s ease-out;
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
                
                /* Smooth transitions for nested menus */
                .nested-dropdown-menu {
                    opacity: 0;
                    animation: fadeInSmooth 0.2s ease-out forwards;
                }
                
                @keyframes fadeInSmooth {
                    from { 
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default TopNavigation;