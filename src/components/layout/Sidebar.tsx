import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Home,
  Menu,
  X,
  ArrowRight,
  LogOut,
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
    // Dashboard - visible to all authenticated users
    '/': [],

    // User routes with updated permissions
    '/admin/users/user-details': ['can_list_users', 'can_view_users'],
    '/admin/users/countrywise-Analysis': ['can_list_users', 'can_view_users'],
    '/admin/users/reported-user-list': ['can_view_reported_users', 'can_list_reports', 'can_view_reports'],

    // Group routes with group-specific permissions
    '/admin/Group/all-group-list': ['can_list_groups', 'can_view_groups'],
    '/admin/Group/all-reported-group-list': ['can_view_reported_groups', 'can_list_reports', 'can_view_reports'],

    // User management routes
    '/admin/system/users': ['can_list_staff', 'can_view_users'],
    '/admin/system/roles': ['can_list_roles', 'can_view_roles'],

    // Livestream routes
    '/admin/livestreams/all-livestreams': [],
    '/admin/livestreams/scheduled': [],
    '/admin/livestreams/settings': [],
    '/admin/livestreams/categories': [],
    '/admin/livestreams/featured': [],
    '/admin/livestreams/analytics': [],
    '/admin/livestreams/moderation': [],
    '/admin/livestreams/reported': ['can_list_reports', 'can_view_reports'],

    // Finance routes
    '/admin/finance/transactions': [],
    '/admin/finance/user-wallets': [],
    '/admin/finance/withdrawals': [],
    '/admin/finance/top-ups': [],
    '/admin/finance/payment-methods': [],
    '/admin/finance/reports': [],
    '/admin/finance/gift-history': [],

    // Gift routes with media permissions
    '/admin/gifts/add-gift': ['can_create_media'],
    '/admin/gifts/gift-list': ['can_list_media', 'can_view_media'],
    '/admin/gifts/gift-categories': ['can_list_media', 'can_view_media'],

    // Settings routes
    '/admin/settings': ['can_view_settings', 'can_update_settings'],
    '/admin/languages': ['can_list_languages', 'can_view_languages'],
    '/admin/logs': [], // Typically would require some admin permissions
    '/admin/support': [],

    // Media routes
    '/admin/Wallpaper/list-all-wallpaper': ['can_list_media', 'can_view_media'],
    '/admin/Wallpaper/add-a-new-wallpaper': ['can_create_media'],
    '/admin/Avatar/list-all-avatar': ['can_list_media', 'can_view_media'],
    '/admin/Avatar/add-a-new-avatar': ['can_create_media'],

    // Detail routes that need the same permissions as their list views
    '/admin/users/user-details/:id': ['can_view_users'],
    '/admin/users/countrywise-Analysis/:id': ['can_view_users'],
    '/admin/Group/all-group-list/:id': ['can_view_groups'],
    '/admin/system/roles/:id': ['can_view_roles'],
    '/admin/system/roles/create': ['can_create_roles'],
    '/admin/finance/user-wallets/:id': [],
    '/admin/languages/:id/translations': ['can_view_languages'],

    // Support routes
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
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const user = Cookies.get('userData') ? JSON.parse(Cookies.get('userData') as string) : null;
  const userPermissions = user?.permissions || [];

  // Debug permission check for current route
  useEffect(() => {
    const currentPath = location.pathname;
    const requiredPermissions = getRequiredPermissionsForRoute(currentPath);
    const hasPermission = hasPermissionForRoute(currentPath, userPermissions);

    console.log({
      currentPath,
      requiredPermissions,
      hasPermission,
      userPermissions
    });
  }, [location.pathname, userPermissions]);

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

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({
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

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userData');
    navigate('/auth/login');
    window.location.reload();
  };

  const renderIcon = (icon: React.FC<React.SVGProps<SVGSVGElement>>, isActivePage: boolean) => {
    const IconComponent = icon || Home;
    return (
      <IconComponent
        width={16}
        height={16}
        className={`${isActivePage ? 'text-blue-600' : 'text-gray-500'} transition-colors`}
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
        <div className="my-1">
          <NavLink
            to={item.path}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => isMobile && setCollapsed && setCollapsed(true)}
          >
            <div
              className={`
                flex items-center py-2 px-3 rounded-xl transition-all duration-200 relative hover:translate-x-0.5 
                ${isActivePage
                  ? 'text-blue-600 font-medium border-0 bg-gradient-to-r from-blue-50/80 to-indigo-50/60'
                  : 'text-gray-700 hover:text-blue-500'
                }
              `}
              style={{ paddingLeft }}
            >
              {isActivePage && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 rounded-xl backdrop-blur-sm ring-1 ring-blue-100/30"
                  style={{ zIndex: -1 }}
                />
              )}

              {item.icon && (
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 mr-3
                    ${isActivePage ? 'bg-gradient-to-br from-blue-100/90 to-indigo-50/70' : 'bg-gray-50/80'}
                    ${isHovered && !isActivePage ? 'bg-gradient-to-br from-blue-50/60 to-indigo-50/40' : ''}
                  `}
                >
                  {renderIcon(item.icon, isActivePage)}
                </div>
              )}
              <span
                className={`text-sm transition-all font-medium 
                  ${isActivePage ? 'text-blue-600' : 'text-gray-600'}
                `}
              >
                {item.title}
              </span>

              {isHovered && !isActivePage && (
                <span
                  className="ml-auto text-blue-400 opacity-80 transition-all duration-200"
                >
                  <ArrowRight size={14} />
                </span>
              )}

              {isActivePage && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-400 rounded-r-full"
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
      const isHovered = hoveredItem === itemKey;

      return (
        <div className="my-1">
          <button
            onClick={() => toggleDropdown(item.key)}
            className={`
              flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all duration-200
              hover:translate-x-0.5 
              ${hasActive || isOpen
                ? 'text-blue-600 font-medium'
                : 'text-gray-700 hover:text-blue-500'
              }
              relative
            `}
            style={{ paddingLeft }}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {(hasActive || isOpen) && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/30 rounded-xl backdrop-blur-sm"
                style={{ zIndex: -1 }}
              />
            )}
            <div className="flex items-center">
              {item.icon && (
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 mr-3
                    ${hasActive || isOpen ? 'bg-gradient-to-br from-blue-100/90 to-indigo-50/70' : 'bg-gray-50/80'}
                    ${isHovered && !hasActive && !isOpen ? 'bg-gradient-to-br from-blue-50/60 to-indigo-50/40' : ''}
                  `}
                >
                  {renderIcon(item.icon, hasActive || isOpen)}
                </div>
              )}
              <span
                className={`text-sm font-medium ${hasActive || isOpen ? 'text-blue-600' : 'text-gray-600'}`}
              >
                {item.title}
              </span>
            </div>
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200
                ${isOpen ? 'bg-blue-50' : 'bg-transparent'} 
              `}
            >
              <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "text-blue-500 transform rotate-180" : "text-gray-400"}`} />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div
              className="ml-6 pl-2 border-l border-blue-100/60"
            >
              {filteredItems.map((subItem: any, idx: number) => (
                <div
                  key={idx}
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

      return (
        <div
          className="mt-6 first:mt-2 mb-2"
        >
          {level === 0 && (
            <div className="px-5 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.title}</span>
            </div>
          )}
          <div className="space-y-1">
            {item.items.map((subItem: any, idx: number) => (
              <div key={idx}>
                {renderNavItem(subItem, level)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderUserProfileSection = () => {
    return (
      <div className="mt-auto pt-4 pb-6 px-3">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center px-2 py-2 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 backdrop-blur-sm">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
            <div className="ml-2">
              <div className="relative group">
                <button className="p-1.5 rounded-full hover:bg-white/60 transition-all duration-150 text-gray-500 hover:text-blue-600">
                  <Settings size={16} />
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-lg py-1.5 px-1 text-xs text-gray-700">
                    Account settings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-xl py-2 px-3 transition-all duration-200 bg-red-50 hover:bg-red-100/80 text-red-600 hover:text-red-700"
            >
              <LogOut size={16} className="mr-2" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className="flex flex-col h-[100vh] bg-white/95 backdrop-blur-xl overflow-y-auto border-r border-gray-100/80 glass-morphism"
    >
      <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100/70">
        <div>
          <NavLink to="/" className="flex items-center">
            <div
              className="relative transition-all duration-200 group"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto rounded-xl transition-all duration-200 group-hover:opacity-90"
              />
              <div
                className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-blue-200/20 to-indigo-200/10 blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </NavLink>
        </div>
        {isMobile && (
          <button
            onClick={() => setCollapsed && setCollapsed(true)}
            className="p-2 rounded-lg hover:bg-gray-100/60 transition-all duration-150"
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
        
        /* Modern glass morphism */
        .glass-morphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-right: 1px solid rgba(235, 240, 255, 0.2);
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