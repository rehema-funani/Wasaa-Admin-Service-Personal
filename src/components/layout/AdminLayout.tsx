import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps { }

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100/80">
      <div className="w-[17%] shadow-lg shadow-gray-100/50 relative z-20">
        <motion.div
          className="h-full glass-morphism"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Sidebar />
        </motion.div>
      </div>

      <div className="w-full md:w-[83%] flex flex-col h-[100vh]">
        <div className="sticky top-0 z-10">
          <motion.div
            className="glass-header shadow-sm"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            <Header />
          </motion.div>
        </div>

        <main className="flex-grow overflow-x-auto w-full overflow-y-auto relative">
          <motion.div
            className="absolute inset-0 bg-noise opacity-5 pointer-events-none"
            animate={{
              opacity: [0.03, 0.05, 0.03],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          <div className="w-full mx-auto p-6 relative z-10">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  className="flex justify-center items-center h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="relative"
                  >
                    <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
                    <div className="absolute inset-0 blur-xl bg-indigo-300/20 rounded-full scale-150" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className="w-full"
                >
                  {/* <motion.div
                    className="mb-6 pb-4 border-b border-gray-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
                      {pageTitle}
                    </h1>
                    <div className="h-px w-20 bg-gradient-to-r from-indigo-500 to-blue-400 mt-2 rounded-full" />
                  </motion.div> */}

                  <motion.div
                    className="content-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    <Outlet />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-100/30 to-transparent pointer-events-none" />
        </main>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Footer />
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-md z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* Glass morphism effect for modern UI */
        .glass-morphism {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-right: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        /* Header with glass effect */
        .glass-header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(230, 232, 240, 0.8);
        }
        
        /* Content cards with subtle depth */
        .content-card {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.03), 
                      0 2px 8px -1px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.7);
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
        
        /* Subtle noise texture */
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;