import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Home,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import logo from '../../assets/images/logo-wasaa.png'
import routes, { LinkRoute, DropdownRoute, SectionRoute } from '../../constants/routes';

type RouteItem = LinkRoute | DropdownRoute | SectionRoute;

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
      if (window.innerWidth >= 720) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

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
      const isActivePage = isActive(item.path);
      const isHovered = hoveredItem === itemKey;

      return (
        <div className="my-1">
          <NavLink
            to={item.path}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className={`
                flex items-center py-1.5 px-3 rounded-lg transition-all duration-150 relative hover:translate-x-0.5 
                ${isActivePage
                  ? 'text-blue-600 font-medium border-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/40'
                  : 'text-gray-700 hover:text-blue-500'
                }
              `}
              style={{ paddingLeft }}
            >
              {isActivePage && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-lg backdrop-blur-sm ring-1 ring-blue-100/20"
                  style={{ zIndex: -1 }}
                />
              )}

              {item.icon && (
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 mr-2.5
                    ${isActivePage ? 'bg-gradient-to-br from-blue-100/80 to-indigo-50/60' : 'bg-gray-50/60'}
                    ${isHovered && !isActivePage ? 'bg-gradient-to-br from-blue-50/50 to-indigo-50/30' : ''}
                  `}
                >
                  {renderIcon(item.icon, isActivePage)}
                </div>
              )}
              <span
                className={`text-[13px] transition-all font-medium 
                  ${isActivePage ? 'text-blue-600' : 'text-gray-600'}
                `}
              >
                {item.title}
              </span>

              {isHovered && !isActivePage && (
                <span
                  className="ml-auto text-blue-400 opacity-70 transition-all duration-150"
                >
                  <ArrowRight size={12} />
                </span>
              )}

              {isActivePage && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-r-full"
                />
              )}
            </div>
          </NavLink>
        </div>
      );
    }

    if (item.type === 'dropdown') {
      const isOpen = openDropdowns[item.key];
      const hasActive = hasActiveChild(item.items);
      const isHovered = hoveredItem === itemKey;

      return (
        <div className="my-1">
          <button
            onClick={() => toggleDropdown(item.key)}
            className={`
              flex items-center justify-between w-full py-1.5 px-3 rounded-lg transition-all duration-150
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
                className="absolute inset-0 bg-gradient-to-r from-blue-50/40 to-indigo-50/20 rounded-lg backdrop-blur-sm"
                style={{ zIndex: -1 }}
              />
            )}
            <div className="flex items-center">
              {item.icon && (
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 mr-2.5
                    ${hasActive || isOpen ? 'bg-gradient-to-br from-blue-100/80 to-indigo-50/60' : 'bg-gray-50/60'}
                    ${isHovered && !hasActive && !isOpen ? 'bg-gradient-to-br from-blue-50/50 to-indigo-50/30' : ''}
                  `}
                >
                  {renderIcon(item.icon, hasActive || isOpen)}
                </div>
              )}
              <span
                className={`text-[13px] font-medium ${hasActive || isOpen ? 'text-blue-600' : 'text-gray-600'}`}
              >
                {item.title}
              </span>
            </div>
            <div
              className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-150
                ${isOpen ? 'bg-blue-50' : 'bg-transparent'} 
              `}
            >
              <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "text-blue-500 transform rotate-180" : "text-gray-400"}`} />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div
              className="ml-5 pl-2 border-l border-blue-100/50"
            >
              {item.items.map((subItem: any, idx: number) => (
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
      return (
        <div
          className="mt-4 first:mt-1 mb-1"
        >
          {level === 0 && (
            <div className="px-4 py-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{item.title}</span>
            </div>
          )}
          <div className="space-y-0.5">
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

  const renderMobileMenuButton = () => {
    return (
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg hover:shadow-blue-200/50 transition-all duration-200 backdrop-blur-md"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <div className="transition-all duration-150">
            <X size={20} />
          </div>
        ) : (
          <div className="transition-all duration-150">
            <Menu size={20} />
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      <aside
        className={`
          flex flex-col h-full bg-white/90 backdrop-blur-xl
          transition-all duration-300 overflow-hidden border-r border-gray-100/70
          ${isMobile ? 'hidden' : 'block'}
        `}
      >
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100/50">
          <div>
            <NavLink to="/" className="flex items-center">
              <div
                className="relative transition-all duration-150"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="h-9 w-auto rounded-lg transition-all duration-150"
                />
                <div
                  className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-blue-200/10 to-indigo-200/5 blur-sm -z-10"
                />
              </div>
              <div
                className="ml-2 hidden lg:block"
              >
                <span className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                  Wasaa
                </span>
              </div>
            </NavLink>
          </div>
        </div>

        <nav
          className="px-2 py-2 overflow-y-auto h-[calc(100vh-3.5rem)] hide-scrollbar bg-gradient-to-b from-white/90 to-white/70"
        >
          {routes.map((item: RouteItem, idx: number) => (
            <div
              key={idx}
            >
              {renderNavItem(item)}
            </div>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <aside
          className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden overflow-auto"
          style={{
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100/50">
            <NavLink to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-medium text-sm shadow-md">
                W
              </div>
              <span className="ml-2 text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                Wasaa
              </span>
            </NavLink>

            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100/50 transition-all duration-150"
              aria-label="Close menu"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <nav className="p-2 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
            {routes.map((item: RouteItem, idx: number) => (
              <div
                key={idx}
              >
                {renderNavItem(item)}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {renderMobileMenuButton()}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* iOS 18-like glass morphism */
        .glass-morphism {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* For dropdown animation - smoother transitions */
        .max-h-96 {
          max-height: 24rem;
        }
      `}</style>
    </>
  );
};

export default Sidebar;