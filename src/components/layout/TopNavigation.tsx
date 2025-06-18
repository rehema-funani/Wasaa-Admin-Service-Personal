import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown, Search, X, Bell,
  ArrowRight, Menu, User,
  Settings, LogOut, CreditCard,
  AlertCircle, BarChart3,
  Shield, Wallet
} from 'lucide-react';
import Cookies from 'js-cookie';
import routes from '../../constants/routes';
import logo from '../../assets/images/logo-wasaa.png';
import { routePermissionsMap } from '../../utils/permissions';

const getRequiredPermissionsForRoute = (path: string) => {

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

const TopNavigation = () => {
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

  const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
  const userPermissions = user?.role?.role_permissions;
  const notifications = [];

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

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setActiveNestedDropdown(null);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearchResults(false);
    setIsSearchOpen(false);
  };

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

  const handleSearchChange = (e) => {
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

  const handleResultClick = (result) => {
    navigate(result.path);
    closeAllMenus();
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const getNotificationIcon = (type: any) => {
    switch (type) {
      case 'transaction':
        return (
          <div className="p-2 rounded-full bg-emerald-50/80 border border-emerald-100/80 backdrop-blur-sm">
            <CreditCard size={16} className="text-emerald-500" />
          </div>
        );
      case 'alert':
        return (
          <div className="p-2 rounded-full bg-amber-50/80 border border-amber-100/80 backdrop-blur-sm">
            <AlertCircle size={16} className="text-amber-500" />
          </div>
        );
      case 'system':
        return (
          <div className="p-2 rounded-full bg-violet-50/80 border border-violet-100/80 backdrop-blur-sm">
            <Shield size={16} className="text-violet-500" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-indigo-50/80 border border-indigo-100/80 backdrop-blur-sm">
            <Bell size={16} className="text-indigo-500" />
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
          className={`w-full flex items-center p-4 rounded-2xl transition-all duration-500 ${isActive
            ? 'bg-gradient-to-r from-indigo-100/90 to-sky-100/90 text-indigo-700 shadow-xl shadow-indigo-500/10'
            : 'hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-sky-50/60'
            }`}
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 mr-4 shadow-lg ${isActive
            ? 'bg-gradient-to-br from-indigo-200/90 to-sky-200/90 scale-105'
            : 'bg-gradient-to-br from-white/90 to-slate-50/90 group-hover:from-indigo-100/90 group-hover:to-sky-100/90'
            }`}>
            <dropdown.icon size={20} className={`transition-colors duration-500 ${isActive ? 'text-indigo-700' : 'text-slate-600 group-hover:text-indigo-600'
              }`} />
          </div>
          <div className="flex-1 text-left">
            <span className={`text-sm font-semibold transition-colors duration-500 ${isActive ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-700'
              }`}>
              {dropdown.title}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-all duration-500 ${isActive
              ? 'rotate-180 text-indigo-600'
              : 'text-slate-400 group-hover:text-indigo-500'
              }`}
          />
        </button>

        {isActive && (
          <div className="mt-2 p-2 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 border border-white/80 animate-dropDown overflow-hidden">
            {filteredItems.map((subItem, subIdx) => (
              <NavLink
                key={subIdx}
                to={subItem.path}
                onClick={() => closeAllMenus()}
                className={({ isActive }) => `
                  group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-sky-50/60 transition-all duration-500 transform hover:translate-x-1
                  ${isActive ? 'bg-white/80 shadow-sm shadow-indigo-500/5' : ''}
                `}
              >
                <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors duration-500 mr-4 flex-shrink-0"></div>
                <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors duration-500">
                  {subItem.title}
                </span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1 ml-auto" />
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
      <div className="absolute top-full left-0 mt-3 bg-white/90 rounded-3xl shadow-2xl shadow-indigo-900/10 border border-white/40 overflow-hidden z-50 animate-fadeInDown min-w-[400px] max-w-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-white/10 -z-10"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar relative">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-[0.15em] mb-1">{section.title}</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full"></div>
          </div>
          <div className="space-y-2">
            {filteredItems.map((item, idx) => {
              if (item.type === 'link') {
                return (
                  <NavLink
                    key={idx}
                    to={item.path}
                    onClick={() => closeAllMenus()}
                    className={({ isActive }) => `
                      group flex items-center p-4 rounded-2xl transition-all duration-500 transform hover:translate-x-1
                      ${isActive
                        ? 'bg-white/70 shadow-sm shadow-indigo-500/10'
                        : 'hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-sky-50/60'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/90 to-slate-50/90 group-hover:from-indigo-100/90 group-hover:to-sky-100/90 transition-all duration-500 mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                      <item.icon size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors duration-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors duration-500 block">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-xs text-slate-500 group-hover:text-indigo-500 transition-colors duration-500 mt-1 block">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1" />
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
          onClick={() => closeAllMenus()}
          className={({ isActive }) => `
            group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 transform hover:scale-105
            ${isActive
              ? 'text-indigo-700 bg-gradient-to-r from-indigo-50/80 to-sky-50/80 shadow-lg shadow-indigo-500/10'
              : 'text-slate-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-sky-50/50'
            }
          `}
        >
          <item.icon size={18} className="mr-3 group-hover:scale-110 transition-transform duration-500" />
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
            className={`group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 transform hover:scale-105 ${activeDropdown === item.title
              ? 'text-indigo-700 bg-gradient-to-r from-indigo-50/80 to-sky-50/80 shadow-lg shadow-indigo-500/10'
              : 'text-slate-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-sky-50/50'
              }`}
          >
            <span>{item.title}</span>
            <ChevronDown
              size={16}
              className={`ml-2 transition-all duration-500 ${activeDropdown === item.title
                ? 'rotate-180 text-indigo-600'
                : 'text-slate-400 group-hover:text-indigo-500'
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
      {/* Advanced gradient bar with liquid animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 bg-[length:200%_100%] animate-gradient-flow"></div>

      {/* Liquid light effects */}
      <div className="absolute -top-10 right-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className={`relative transition-all duration-500 ${scrolled
        ? 'bg-white/60 backdrop-blur-2xl shadow-xl shadow-indigo-900/5 border-b border-white/40'
        : 'bg-white/50 backdrop-blur-xl'
        }`}>

        {/* Highlight reflections */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-40 h-1 bg-white/80 blur-sm rotate-45 transform-gpu animate-shine"></div>
          <div className="absolute top-20 right-1/4 w-60 h-0.5 bg-white/60 blur-sm -rotate-45 transform-gpu animate-shine animation-delay-2000"></div>
        </div>

        <div className="px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between relative">
          <div className="flex items-center mr-4 lg:mr-12">
            <img
              src={logo}
              alt="Logo"
              className="w-[150px] h-auto cursor-pointer transition-transform duration-500 hover:scale-105"
              onClick={() => navigate('/')}
            />
          </div>

          <nav className="hidden xl:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-2 bg-white/30 backdrop-blur-2xl rounded-3xl p-2 shadow-2xl shadow-indigo-500/5 border border-white/80 transition-all duration-500 hover:shadow-indigo-500/10">
              {filterSections(routes).map((item: any, idx: any) => (
                <div key={idx}>
                  {renderNavItem(item)}
                </div>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-1 md:space-x-3">
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
                      className="w-56 md:w-80 pl-5 pr-12 py-3 rounded-2xl border border-white/70 focus:border-indigo-400/60 focus:outline-none focus:ring-4 focus:ring-indigo-300/20 transition-all duration-500 text-sm font-medium bg-white/30 backdrop-blur-2xl shadow-xl text-gray-800 placeholder-indigo-400/70"
                      autoFocus
                    />
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-200/50 to-white/70 animate-pulse-slow"></div>
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchValue('');
                        setShowSearchResults(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-indigo-700/20 transition-all duration-300 text-indigo-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl hover:bg-white/60 transition-all duration-500 transform hover:scale-110 group text-gray-600/70 hover:text-indigo-600"
                >
                  <Search size={18} className="transition-colors duration-500" />
                </button>
              )}

              {/* Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div
                  ref={searchResultsRef}
                  className="absolute right-0 mt-3 w-80 bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-2xl shadow-indigo-900/10 z-50 overflow-hidden animate-fadeInDown"
                >
                  {/* Light effects */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl"></div>

                  <div className="p-4 relative">
                    <div className="text-xs text-gray-500 mb-3">
                      {searchResults.length} results found for "{searchValue}"
                    </div>

                    <div className="space-y-4">
                      {Object.entries(groupedResults).map(([category, results]) => (
                        <div key={category}>
                          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center">
                            {React.createElement(getCategoryIcon(category), { size: 14, className: "inline mr-1 text-gray-400" })}
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
                                    cursor-pointer p-2 rounded-xl transition-all duration-500 flex items-center
                                    ${isSelected
                                      ? 'bg-gradient-to-r from-indigo-50/80 to-sky-50/80 text-indigo-700 shadow-lg shadow-indigo-500/5'
                                      : 'hover:bg-white/60'
                                    }
                                  `}
                                >
                                  <div className={`
                                    p-1.5 rounded-xl mr-2
                                    ${isSelected ? 'bg-white/70' : 'bg-white/50'}
                                  `}>
                                    {result.icon ? <result.icon size={16} className="text-indigo-500" /> :
                                      React.createElement(getCategoryIcon(result.category), { size: 16, className: "text-indigo-500" })}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {result.title}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {result.path}
                                    </div>
                                  </div>
                                  <div className={`
                                    ml-2 p-1 rounded-full
                                    ${isSelected ? 'bg-white/70 text-indigo-600' : 'text-gray-400'}
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

                    <div className="mt-3 pt-3 border-t border-white/50 text-xs text-gray-500 flex items-center justify-between">
                      <span>
                        <kbd className="px-1.5 py-0.5 rounded-lg bg-white/70 text-gray-700 mx-1 shadow-sm border border-white/50">↑</kbd>
                        <kbd className="px-1.5 py-0.5 rounded-lg bg-white/70 text-gray-700 mx-1 shadow-sm border border-white/50">↓</kbd>
                        to navigate
                      </span>
                      <span>
                        <kbd className="px-1.5 py-0.5 rounded-lg bg-white/70 text-gray-700 mx-1 shadow-sm border border-white/50">Enter</kbd>
                        to select
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="p-2.5 rounded-xl hover:bg-white/60 transition-all duration-500 transform hover:scale-110 group text-gray-600/70 hover:text-indigo-600 relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={18} className="transition-colors duration-500" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-2xl shadow-indigo-900/10 z-50 overflow-hidden animate-fadeInDown">
                  {/* Light effects */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl"></div>

                  <div className="px-4 py-3 border-b border-white/50 flex justify-between items-center relative">
                    <h3 className="font-medium text-gray-800">Notifications</h3>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          relative px-4 py-3 hover:bg-indigo-50/50 cursor-pointer transition-all duration-500
                          ${!notification.read ? 'bg-indigo-50/30' : ''}
                        `}
                      >
                        <div className="flex items-start">
                          <div className="mt-0.5 mr-3">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full"></div>
                          )}
                        </div>

                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none animate-shine-slow"></div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2 border-t border-white/50 relative">
                    <button className="w-full text-xs text-center text-indigo-600 hover:text-indigo-700 font-medium py-1 transition-colors duration-200">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button
                className="flex items-center space-x-2 py-1.5 px-2 rounded-xl transition-all duration-500 hover:bg-white/60 text-gray-600/90 hover:text-indigo-600 group"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600/90 to-sky-600/80 backdrop-blur-xl flex items-center justify-center border border-white/40 group-hover:from-indigo-500/90 group-hover:to-sky-500/80 transition-all duration-500 shadow-lg">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                <ChevronDown
                  size={14}
                  className={`hidden md:block transition-all duration-500 ${userMenuOpen ? 'rotate-180 text-indigo-500' : 'text-indigo-300 group-hover:text-indigo-500'}`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-2xl shadow-indigo-900/10 z-50 overflow-hidden animate-fadeInDown">
                  {/* Light effects */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl"></div>

                  <div className="relative">
                    {/* Glass profile card */}
                    <div className="px-4 py-3 border-b border-white/50">
                      <p className="font-medium text-gray-800">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <div className="mt-1.5 flex items-center">
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-indigo-100/80 text-indigo-700 rounded-full">
                          {user?.role?.title}
                        </span>
                      </div>
                    </div>

                    <div className="px-1 py-1">
                      <NavLink
                        to="/profile"
                        onClick={() => closeAllMenus()}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center transition-all duration-500"
                      >
                        <User size={16} className="mr-3 text-gray-500" />
                        <span>My Profile</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={() => closeAllMenus()}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center transition-all duration-500"
                      >
                        <Settings size={16} className="mr-3 text-gray-500" />
                        <span>Settings</span>
                      </NavLink>
                    </div>

                    <div className="border-t border-white/50 mt-1 px-1 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 text-sm flex items-center text-red-600 transition-all duration-500"
                      >
                        <LogOut size={16} className="mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl hover:bg-white/60 transition-all duration-500 text-gray-600/70 hover:text-indigo-600 ml-1"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 left-[60px] w-[calc(100%-60px)] bg-white/95 backdrop-blur-2xl animate-fadeIn">
          {/* Mobile light effects */}
          <div className="absolute top-40 left-20 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-[150px] h-auto cursor-pointer transition-transform duration-500 hover:scale-105"
                  onClick={() => {
                    navigate('/');
                    closeAllMenus();
                  }}
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/60 hover:bg-indigo-50/80 transition-all duration-500 text-gray-600 shadow-lg border border-white/40"
              >
                <X size={22} className="transition-transform duration-500 hover:rotate-90" />
              </button>
            </div>

            <nav className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              {filterSections(routes).map((item, idx) => (
                <div key={idx} className="py-2">
                  {item.type === 'section' && (
                    <>
                      <div className="flex items-center mb-4">
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em]">
                          {item.title}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent ml-4"></div>
                      </div>
                      <div className="space-y-2">
                        {filterItems(item.items).map((subItem, subIdx) => {
                          if (subItem.type === 'link') {
                            return (
                              <NavLink
                                key={subIdx}
                                to={subItem.path}
                                className={({ isActive }) => `
                                  flex items-center px-4 py-3.5 rounded-2xl transition-all duration-500 group
                                  ${isActive
                                    ? 'bg-gradient-to-r from-indigo-50/90 to-sky-50/90 border border-white/50 shadow-lg shadow-indigo-500/10'
                                    : 'hover:bg-white/60'
                                  }
                                `}
                                onClick={() => closeAllMenus()}
                              >
                                {subItem.icon && (
                                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/90 to-slate-50/90 group-hover:from-indigo-100/90 group-hover:to-sky-100/90 transition-all duration-500 mr-4 shadow-lg border border-white/40 group-hover:scale-105">
                                    <subItem.icon width={18} height={18} className="text-indigo-600" />
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-gray-800">{subItem.title}</span>
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

            <div className="mt-8 pt-6 border-t border-indigo-200/50">
              <div className="flex items-center p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-500/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/90 to-sky-600/80 flex items-center justify-center mr-4 border border-white/40 shadow-lg">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
                  <div className="text-xs text-indigo-600">{user?.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/60 hover:bg-red-50/80 transition-all duration-500 text-red-500 border border-white/40 shadow-lg active:scale-95"
                >
                  <LogOut size={16} className="transition-transform duration-500 hover:rotate-12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavigation;
