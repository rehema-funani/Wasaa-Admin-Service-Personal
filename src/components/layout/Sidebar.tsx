import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Home,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

import routes, { LinkRoute, DropdownRoute, SectionRoute } from '../../constants/routes';

type RouteItem = LinkRoute | DropdownRoute | SectionRoute;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
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
        className={`${isActivePage ? 'text-indigo-600' : 'text-gray-700'} transition-colors`}
        strokeWidth={1.8}
      />
    );
  };

  const renderNavItem = (item: RouteItem, level = 0) => {
    const paddingLeft = level * 12 + 16;
    const itemKey = item.type === 'link' ? item.path : item.type === 'dropdown' ? item.key : item.title;

    if (item.type === 'link') {
      const isActivePage = isActive(item.path);
      const isHovered = hoveredItem === itemKey;

      return (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <NavLink
            to={item.path}
            className={({ isActive }) => ``}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              className={`
                flex items-center py-2.5 px-4 rounded-2xl transition-all relative
                ${isActivePage
                  ? 'text-indigo-600 font-medium'
                  : 'text-gray-700 hover:text-indigo-500'
                }
              `}
              style={{ paddingLeft }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              {isActivePage && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-50/80 to-blue-50/50 rounded-2xl backdrop-blur-sm"
                  layoutId="activeBackground"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}

              {item.icon && (
                <motion.span
                  className="mr-3 flex items-center justify-center"
                  animate={{
                    scale: isHovered || isActivePage ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {renderIcon(item.icon, isActivePage)}
                </motion.span>
              )}
              {!collapsed && (
                <motion.span
                  className={`text-[12px] font-normal transition-all ${isActivePage ? 'text-indigo-600' : 'text-gray-800'}`}
                  animate={{
                    x: isHovered && !isActivePage ? 4 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                </motion.span>
              )}

              {!collapsed && isHovered && !isActivePage && (
                <motion.span
                  className="ml-auto text-indigo-400"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              )}
            </motion.div>
          </NavLink>
        </motion.div>
      );
    }

    if (item.type === 'dropdown') {
      const isOpen = openDropdowns[item.key];
      const hasActive = hasActiveChild(item.items);
      const isHovered = hoveredItem === itemKey;

      return (
        <div>
          <motion.button
            onClick={() => toggleDropdown(item.key)}
            className={`
              flex items-center justify-between w-full py-2.5 px-4 rounded-2xl transition-all duration-200
              ${hasActive
                ? 'text-indigo-600 font-medium'
                : 'text-gray-700 hover:text-indigo-500'
              }
              relative
            `}
            style={{ paddingLeft }}
            whileHover={{ x: 2, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {(hasActive || isOpen) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-blue-50/30 rounded-2xl backdrop-blur-sm"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
            )}
            <div className="flex items-center">
              {item.icon && (
                <motion.span
                  className="mr-3 flex items-center justify-center"
                  animate={{
                    scale: isHovered || hasActive || isOpen ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {renderIcon(item.icon, hasActive || isOpen)}
                </motion.span>
              )}
              {!collapsed && (
                <motion.span
                  className={`text-[12px] font-normal ${hasActive || isOpen ? 'text-indigo-600' : 'text-gray-800'}`}
                >
                  {item.title}
                </motion.span>
              )}
            </div>
            {!collapsed && (
              <motion.span
                className="text-gray-400"
                animate={{
                  rotate: isOpen ? 180 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {isOpen && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div
                  className="mt-1 ml-6 pl-2 border-l border-indigo-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {item.items.map((subItem: any, idx: number) => (
                    <motion.div
                      key={idx}
                      className="mt-1"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.05 * idx }}
                    >
                      {renderNavItem(subItem, level + 1)}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (item.type === 'section') {
      return (
        <motion.div
          className="mt-6 first:mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {!collapsed && (
            <motion.h3
              className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {item.title}
            </motion.h3>
          )}
          <div className="space-y-1">
            {item.items.map((subItem: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
              >
                {renderNavItem(subItem, level)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }

    return null;
  };

  const renderMobileMenuButton = () => {
    return (
      <motion.button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg hover:shadow-indigo-200/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={false}
        animate={{
          boxShadow: mobileOpen
            ? '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
            : '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
        }}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <>
      <motion.aside
        className={`
          flex flex-col h-full bg-white/80 border-r border-gray-100 backdrop-blur-xl
          transition-all duration-300 z-30 overflow-hidden
          ${isMobile ? 'hidden' : 'block'}
        `}
        initial={false}
        animate={{
          width: collapsed ? 80 : 256,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.03)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <motion.div
          className="h-16 flex items-center justify-between px-4 border-b border-gray-50"
          initial={false}
          animate={{
            paddingLeft: collapsed ? 16 : 16
          }}
        >
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NavLink to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200/50">
                  WC
                </div>
                <motion.span
                  className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Wasaa chat
                </motion.span>
              </NavLink>
            </motion.div>
          ) : (
            <motion.div
              className="mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200/50">
                SP
              </div>
            </motion.div>
          )}

          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-indigo-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ChevronUp size={18} className="text-indigo-400" />
            </motion.div>
          </motion.button>
        </motion.div>

        <motion.nav
          className="p-3 overflow-y-auto h-[calc(100vh-4rem)] hide-scrollbar"
          initial={false}
          animate={{ opacity: 1 }}
        >
          {routes.map((item: RouteItem, idx: number) => (
            <motion.div
              key={idx}
              className="mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.03 * idx }}
            >
              {renderNavItem(item)}
            </motion.div>
          ))}
        </motion.nav>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed inset-0 bg-white/90 backdrop-blur-lg z-40 lg:hidden overflow-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-50">
              <NavLink to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200/50">
                  WC
                </div>
                <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                  Wasaa Chat
                </span>
              </NavLink>

              <motion.button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-indigo-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close menu"
              >
                <X size={20} className="text-indigo-400" />
              </motion.button>
            </div>

            <motion.nav className="p-3 overflow-y-auto">
              {routes.map((item: RouteItem, idx: number) => (
                <motion.div
                  key={idx}
                  className="mb-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                >
                  {renderNavItem(item)}
                </motion.div>
              ))}
            </motion.nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {renderMobileMenuButton()}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;