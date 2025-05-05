import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
        className={`${isActivePage ? 'text-indigo-600' : 'text-gray-600'} transition-colors`}
        strokeWidth={1.5}
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
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              className={`
                flex items-center py-2.5 px-4 rounded-xl transition-all relative
                ${isActivePage
                  ? 'text-indigo-600 font-medium border-0 bg-gradient-to-r from-indigo-50/80 to-blue-50/80'
                  : 'text-gray-700 hover:text-indigo-500'
                }
              `}
              style={{ paddingLeft }}
              whileHover={{
                x: 4,
                scale: 1.02,
                transition: { duration: 0.2, type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isActivePage && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-50/90 to-blue-50/80 rounded-xl backdrop-blur-sm ring-1 ring-white/50"
                  layoutId="activeBackground"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  style={{ zIndex: -1 }}
                />
              )}

              {item.icon && (
                <motion.div
                  className={`mr-3 flex items-center justify-center w-8 h-8 rounded-full ${isActivePage ? 'bg-gradient-to-br from-indigo-100 to-blue-50' : 'bg-gray-50/60'}`}
                  animate={{
                    scale: isHovered || isActivePage ? 1.1 : 1,
                    background: isHovered && !isActivePage ? 'linear-gradient(to bottom right, rgba(238, 242, 255, 0.8), rgba(224, 231, 255, 0.5))' : (isActivePage ? 'linear-gradient(to bottom right, rgba(224, 231, 255, 0.9), rgba(199, 210, 254, 0.6))' : 'rgba(249, 250, 251, 0.6)')
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {renderIcon(item.icon, isActivePage)}
                </motion.div>
              )}
              <motion.span
                className={`text-[14px] transition-all font-medium ${isActivePage ? 'text-indigo-600' : 'text-gray-500'}`}
                animate={{
                  x: isHovered && !isActivePage ? 2 : 0,
                  opacity: isHovered && !isActivePage ? 0.9 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {item.title}
              </motion.span>

              {isHovered && !isActivePage && (
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

              {isActivePage && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-400 rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
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
              flex items-center justify-between w-full py-2.5 px-4 rounded-xl transition-all duration-200
              ${hasActive || isOpen
                ? 'text-indigo-600 font-medium'
                : 'text-gray-700 hover:text-indigo-500'
              }
              relative
            `}
            style={{ paddingLeft }}
            whileHover={{
              x: 2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredItem(itemKey)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {(hasActive || isOpen) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-50/70 to-blue-50/50 rounded-xl backdrop-blur-sm ring-1 ring-indigo-100/50"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
            )}
            <div className="flex items-center">
              {item.icon && (
                <motion.div
                  className={`mr-3 flex items-center justify-center w-8 h-8 rounded-full ${hasActive || isOpen ? 'bg-gradient-to-br from-indigo-100 to-blue-50' : 'bg-gray-50/60'}`}
                  animate={{
                    scale: isHovered || hasActive || isOpen ? 1.1 : 1,
                    background: isHovered && !hasActive && !isOpen ? 'linear-gradient(to bottom right, rgba(238, 242, 255, 0.8), rgba(224, 231, 255, 0.5))' : ((hasActive || isOpen) ? 'linear-gradient(to bottom right, rgba(224, 231, 255, 0.9), rgba(199, 210, 254, 0.6))' : 'rgba(249, 250, 251, 0.6)')
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {renderIcon(item.icon, hasActive || isOpen)}
                </motion.div>
              )}
              <motion.span
                className={`text-[14px] font-medium ${hasActive || isOpen ? 'text-indigo-600' : 'text-gray-700'}`}
              >
                {item.title}
              </motion.span>
            </div>
            <motion.div
              className={`flex items-center justify-center w-5 h-5 rounded-full ${isOpen ? 'bg-indigo-100' : 'bg-transparent'}`}
              animate={{
                rotate: isOpen ? 180 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={14} className={isOpen ? "text-indigo-500" : "text-gray-400"} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
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
                      transition={{
                        duration: 0.3,
                        delay: 0.05 * idx,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }}
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
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xl hover:shadow-indigo-200/50 backdrop-blur-md"
        whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(79, 70, 229, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        initial={false}
        animate={{
          boxShadow: mobileOpen
            ? '0 15px 30px -5px rgba(99, 102, 241, 0.5)'
            : '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
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
          flex flex-col h-full bg-white/85 backdrop-blur-xl
          transition-all duration-300 z-30 overflow-hidden
          ${isMobile ? 'hidden' : 'block'}
        `}
        initial={false}
        animate={{
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <div>
            <NavLink to="/" className="flex items-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img
                  src={logo}
                  alt="Logo"
                  className="h-12 w-auto rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-indigo-200/20 to-blue-200/10 blur-sm -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </motion.div>
              <motion.div
                className="ml-2 hidden lg:block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                  Wasaa
                </span>
              </motion.div>
            </NavLink>
          </div>
        </div>

        <motion.nav
          className="p-3 overflow-y-auto h-[calc(100vh-4rem)] hide-scrollbar bg-gradient-to-b from-white/90 to-white/70"
          initial={false}
          animate={{ opacity: 1 }}
        >
          {routes.map((item: RouteItem, idx: number) => (
            <motion.div
              key={idx}
              className="mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.03 * idx,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              {renderNavItem(item)}
            </motion.div>
          ))}
        </motion.nav>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden overflow-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-50/80">
              <NavLink to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200/50 ring-1 ring-white/30">
                  WC
                </div>
                <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                  Wasaa Chat
                </span>
              </NavLink>

              <motion.button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-indigo-50 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close menu"
              >
                <X size={20} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </motion.button>
            </div>

            <motion.nav className="p-3 overflow-y-auto max-h-[calc(100vh-4rem)]">
              {routes.map((item: RouteItem, idx: number) => (
                <motion.div
                  key={idx}
                  className="mb-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05 * idx,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
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
        
        /* Adding subtle iOS 18-like glass morphism effects */
        .glass-morphism {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Light gradient overlays for depth */
        .depth-gradient {
          position: relative;
        }
        .depth-gradient::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.5));
          opacity: 0.7;
        }
      `}</style>
    </>
  );
};

export default Sidebar;