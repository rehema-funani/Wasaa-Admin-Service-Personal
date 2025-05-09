import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Loader2, Menu, X, Grid, User, Wallet, PieChart, CreditCard, Settings, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface AdminLayoutProps { }

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;

    const getTitleFromRoutes = (routeItems: any[]): string | null => {
      for (const item of routeItems) {
        if (item.type === 'link' && item.path === path) {
          return item.title;
        } else if (item.type === 'dropdown' && item.items) {
          for (const subItem of item.items) {
            if (subItem.path === path) {
              return subItem.title;
            }
          }
        } else if (item.type === 'section' && item.items) {
          const title = getTitleFromRoutes(item.items);
          if (title) return title;
        }
      }
      return null;
    };

    import('../../constants/routes').then(module => {
      const routes = module.default;
      const title = getTitleFromRoutes(routes) || 'Dashboard';
      document.title = `${title} | Wasaa CRM`;
    });

  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      // On large screens, we don't want the sidebar to be collapsed
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle mobile menu/sidebar function to pass to Header
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Close floating menu if it's open
    if (floatingMenuOpen) {
      setFloatingMenuOpen(false);
    }
  };

  // Toggle floating menu
  const toggleFloatingMenu = () => {
    setFloatingMenuOpen(!floatingMenuOpen);
  };

  // Floating menu options
  const floatingMenuItems = [
    { icon: Grid, label: "Dashboard", path: "/dashboard" },
    { icon: Wallet, label: "Payments", path: "/payments" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
    { icon: CreditCard, label: "Cards", path: "/cards" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Render floating menu button and menu
  const renderFloatingMenu = () => {
    return (
      <>
        {/* Main floating button - only visible on mobile */}
        <button
          onClick={floatingMenuOpen ? toggleFloatingMenu : toggleSidebar}
          className={`
            fixed z-50 bottom-6 right-6 p-4 rounded-full flex items-center justify-center lg:hidden
            ${floatingMenuOpen
              ? 'bg-white border border-gray-200 text-indigo-600'
              : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white'}
            transition-all duration-300 shadow-lg
          `}
          aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
        >
          <motion.div
            animate={{ rotate: floatingMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {floatingMenuOpen ? (
              <ChevronUp size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={24} strokeWidth={1.8} />
            )}
          </motion.div>
        </button>

        {/* Floating menu items - only visible on mobile */}
        <AnimatePresence>
          {floatingMenuOpen && (
            <div className="fixed z-40 bottom-24 right-6 flex flex-col gap-3 items-end lg:hidden">
              {floatingMenuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                >
                  <button
                    onClick={() => {
                      // Handle navigation
                      setFloatingMenuOpen(false);
                    }}
                    className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-md border border-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                  >
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    <item.icon size={18} strokeWidth={1.8} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80">
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <div
        className={`
          fixed lg:static lg:flex h-full z-40 transition-all duration-300
          ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          lg:w-[350px]
        `}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      <div className="h-[100vh] flex flex-col min-w-0 lg:pl-0">
        <div className="sticky top-0 z-20">
          <div className="glass-header border-b border-gray-50">
            <Header
              mobileMenuOpen={!sidebarCollapsed}
              toggleMobileMenu={toggleSidebar}
              showSearchOnMobile={false}
            />
          </div>
        </div>

        <main className="flex-grow overflow-x-auto w-full overflow-y-auto relative">
          <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

          <div className="w-full mx-auto p-4 md:p-6 relative">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                  <div className="absolute inset-0 blur-xl bg-indigo-300/20 rounded-full scale-150" />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="content-card">
                  <Outlet />
                </div>
              </div>
            )}
          </div>
        </main>

        <div className="relative">
          <Footer />
        </div>
      </div>

      {renderFloatingMenu()}

      <style>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .glass-header {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .content-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(240, 240, 250, 0.8);
          overflow: hidden;
        }
        
        /* Custom scrollbar for iOS feel */
        main::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        main::-webkit-scrollbar-track {
          background: rgba(240, 242, 245, 0.5);
          border-radius: 10px;
        }
        
        main::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.5);
          border-radius: 10px;
        }
        
        main::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;