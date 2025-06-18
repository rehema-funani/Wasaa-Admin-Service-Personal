import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Home,
  X,
  ArrowRight,
  Settings,
} from 'lucide-react';
import logo from '../../assets/images/logo-wasaa.png';
import routes, { LinkRoute, DropdownRoute, SectionRoute } from '../../constants/routes';
import Cookies from 'js-cookie';

type RouteItem = LinkRoute | DropdownRoute | SectionRoute;

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const getRequiredPermissionsForRoute = (path: string): string[] => {
  const routePermissionsMap: Record<string, string[]> = {
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

const hasPermissionForRoute = (path: string, userPermissions: string[]): boolean => {
  const requiredPermissions = getRequiredPermissionsForRoute(path);

  if (requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

const filterDropdownItems = (items: any[], userPermissions: string[]): any[] => {
  return items.filter(item => {
    if (item.type === 'link') {
      return hasPermissionForRoute(item.path, userPermissions);
    }
    return true;
  });
};

const shouldShowSection = (section: SectionRoute, userPermissions: string[]): boolean => {
  const filteredItems = section.items.filter(item => {
    if (item.type === 'link') {
      return hasPermissionForRoute(item.path, userPermissions);
    } else if (item.type === 'dropdown') {
      const filteredDropdownItems = filterDropdownItems(item.items, userPermissions);
      return filteredDropdownItems.length > 0;
    }
    return false;
  });

  return filteredItems.length > 0;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : null;
  const userPermissions = user?.permissions || [];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && setCollapsed) {
      setCollapsed(true);
    }
  }, [location.pathname, isMobile, setCollapsed]);

  useEffect(() => {
    routes.forEach((item) => {
      if (item.type === 'section') {
        const hasActive = hasActiveChild(item.items);
        if (hasActive) {
          setOpenSections(prev => ({
            ...prev,
            [item.title]: true
          }));
        }
      }
    });
  }, [location.pathname]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const hasActiveChild = (items: any[]): boolean => {
    return items.some(item => {
      if (item.type === 'link') {
        return isActive(item.path);
      } else if (item.type === 'dropdown') {
        return hasActiveChild(item.items);
      }
      return false;
    });
  };

  const renderIcon = (icon: React.FC<React.SVGProps<SVGSVGElement>>, isActivePage: boolean) => {
    const IconComponent = icon || Home;
    return (
      <IconComponent
        width={16}
        height={16}
        className={`${isActivePage ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-500'} transition-colors`}
        strokeWidth={1.8}
      />
    );
  };

  const renderNavItem = (item: RouteItem, level = 0) => {
    const paddingLeft = level * 10 + 16;
    const itemKey = item.type === 'link' ? item.path : item.type === 'dropdown' ? item.key : item.title;

    if (item.type === 'link') {
      if (!hasPermissionForRoute(item.path, userPermissions)) {
        return null;
      }

      const isActivePage = isActive(item.path);
      const isHovered = hoveredItem === itemKey;

      return (
        <div className="my-1.5 group">
          <NavLink
            to={item.path}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => isMobile && setCollapsed && setCollapsed(true)}
          >
            <div
              className={`
                flex items-center py-2.5 px-3 rounded-xl transition-all duration-300 relative
                hover:translate-x-0.5 group/item
                ${isActivePage
                  ? 'text-primary-700 font-medium border-0 bg-gradient-to-r from-primary-50/80 to-teal-50/60'
                  : 'text-gray-700 hover:text-primary-600'
                }
              `}
              style={{ paddingLeft }}
            >
              {isActivePage && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary-50/70 via-teal-50/50 to-primary-50/40 rounded-xl backdrop-blur-sm
                  ring-1 ring-primary-100/30 shadow-sm"
                  style={{ zIndex: -1 }}
                />
              )}

              {item.icon && (
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 mr-3.5
                    ${isActivePage ? 'bg-gradient-to-br from-primary-100/90 to-teal-50/70 shadow-sm shadow-primary-100/60' : 'bg-gray-50/80 group-hover/item:bg-gradient-to-br group-hover/item:from-primary-50/60 group-hover/item:to-teal-50/40'}
                  `}
                >
                  {renderIcon(item.icon, isActivePage)}
                </div>
              )}
              <span
                className={`text-sm transition-all font-medium
                  ${isActivePage ? 'text-primary-700' : 'text-gray-600 group-hover/item:text-primary-600'}
                `}
              >
                {item.title}
              </span>

              {(isHovered || isActivePage) && (
                <span
                  className={`ml-auto text-primary-500 opacity-0 group-hover/item:opacity-100 transition-all duration-300
                    ${isActivePage ? 'opacity-70' : ''}`}
                >
                  <ArrowRight size={14} />
                </span>
              )}

              {isActivePage && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-primary-600 via-teal-500 to-primary-500
                  rounded-r-full shadow-md shadow-primary-200"
                />
              )}
            </div>
          </NavLink>
        </div>
      );
    }

    if (item.type === 'dropdown') {
      const filteredItems = filterDropdownItems(item.items, userPermissions);

      if (filteredItems.length === 0) {
        return null;
      }

      const isOpen = openDropdowns[item.key];
      const hasActive = hasActiveChild(filteredItems);

      return (
        <div className="my-1.5 group">
          <button
            onClick={() => toggleDropdown(item.key)}
            className={`
              flex items-center justify-between w-full py-2.5 px-3 rounded-xl transition-all duration-300
              hover:translate-x-0.5
              ${hasActive || isOpen
                ? 'text-primary-700 font-medium'
                : 'text-gray-700 hover:text-primary-600'
              }
              relative group/dropdown
            `}
            style={{ paddingLeft }}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {(hasActive || isOpen) && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary-50/60 to-teal-50/30 rounded-xl backdrop-blur-sm ring-1 ring-primary-100/30"
                style={{ zIndex: -1 }}
              />
            )}
            <div className="flex items-center">
              {item.icon && (
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 mr-3.5
                    ${hasActive || isOpen ? 'bg-gradient-to-br from-primary-100/90 to-teal-50/70 shadow-sm' : 'bg-gray-50/80 group-hover/dropdown:bg-gradient-to-br group-hover/dropdown:from-primary-50/60 group-hover/dropdown:to-teal-50/40'}
                  `}
                >
                  {renderIcon(item.icon, hasActive || isOpen)}
                </div>
              )}
              <span
                className={`text-sm font-medium ${hasActive || isOpen ? 'text-primary-700' : 'text-gray-600 group-hover/dropdown:text-primary-600'}`}
              >
                {item.title}
              </span>
            </div>
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300
                ${isOpen ? 'bg-primary-50 rotate-180' : 'bg-transparent group-hover/dropdown:bg-primary-50/50'}
              `}
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-300
                  ${isOpen ? "text-primary-500 transform rotate-180" : "text-gray-400 group-hover/dropdown:text-primary-400"}`}
              />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? 'max-h-96 opacity-100 my-1' : 'max-h-0 opacity-0'}`}
          >
            <div
              className="ml-7 pl-3 border-l-2 border-primary-100/60"
            >
              {filteredItems.map((subItem: any, idx: number) => (
                <div
                  key={idx}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {renderNavItem(subItem, level + 1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (item.type === 'section') {
      if (!shouldShowSection(item, userPermissions)) {
        return null;
      }

      const isOpen = openSections[item.title] || false;
      const hasActive = hasActiveChild(item.items);

      return (
        <div
          className="mt-7 first:mt-3 mb-2"
        >
          {level === 0 && (
            <div className="px-5 py-1.5 relative mb-2">
              <button
                onClick={() => toggleSection(item.title)}
                className="flex items-center justify-between w-full group/section"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-teal-400 mr-2.5 transition-all duration-300 ${hasActive ? 'scale-125' : ''}`}></div>
                  <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${hasActive ? 'text-primary-700' : 'text-primary-600/90'}`}>
                    {item.title}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300
                    ${isOpen ? 'bg-primary-50' : 'bg-transparent group-hover/section:bg-primary-50/50'}
                  `}
                >
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300
                      ${isOpen ? "text-primary-500 transform rotate-180" : "text-gray-400 group-hover/section:text-primary-400"}`}
                  />
                </div>
              </button>
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-primary-100/50 via-teal-100/30 to-transparent"></div>
            </div>
          )}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="space-y-0.5">
              {item.items.map((subItem: any, idx: number) => (
                <div
                  key={idx}
                  className={isOpen ? "animate-slideIn" : ""}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {renderNavItem(subItem, level)}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderUserProfileSection = () => {
    return (
      <div className="mt-auto pt-4 pb-6 px-3 w-full">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center p-1.5 rounded-xl bg-gradient-to-r from-primary-50/90 to-teal-50/70 backdrop-blur-sm shadow-sm ring-1 ring-primary-100/50">
            <div className="flex-shrink-0 relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-teal-700 flex items-center justify-center text-white font-medium text-xl shadow-md">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
              <div className="flex items-center">
                <p className="text-[9px] font-medium text-primary-700 lowercase tracking-wide">{user.role}</p>
              </div>
            </div>
            <div className="ml-2">
              <div className="relative group">
                <button className="p-2 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-150 text-gray-500 hover:text-primary-600 hover:shadow-md hover:scale-105">
                  <Settings size={16} />
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="bg-white rounded-lg py-1.5 px-2 text-xs text-gray-700 shadow-md">
                    Account settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className="w-full flex flex-col h-[100vh] bg-white/95 backdrop-blur-xl overflow-y-auto border-r border-gray-100/80 finance-glass-morphism relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-100/20 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-100/20 to-transparent rounded-full blur-3xl -z-10"></div>

      <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100/70">
        <div>
          <NavLink to="/" className="flex items-center">
            <div
              className="relative transition-all duration-200 group"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-11 w-auto rounded-xl transition-all duration-300 group-hover:opacity-90 group-hover:scale-105"
              />
              <div
                className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary-200/20 to-teal-200/10 blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </NavLink>
        </div>
        {isMobile && (
          <button
            onClick={() => setCollapsed && setCollapsed(true)}
            className="p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100/60 transition-all duration-150 hover:shadow-sm"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      <nav
        className="px-3 py-4 overflow-y-auto flex-1 hide-scrollbar bg-gradient-to-b from-white/95 to-white/80"
      >
        {routes.map((item: RouteItem, idx: number) => (
          <div
            key={idx}
            className={`${idx > 0 ? 'animate-fadeIn' : ''}`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {renderNavItem(item)}
          </div>
        ))}
      </nav>

      {renderUserProfileSection()}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Financial glass morphism */
        .finance-glass-morphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid rgba(235, 245, 240, 0.3);
          box-shadow: 0 8px 32px rgba(15, 42, 23, 0.03);
        }

        /* Animation keyframes */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-5px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.25s ease-out forwards;
        }

        /* For dropdown animation - smoother transitions */
        .max-h-96 {
          max-height: 24rem;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
