import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageTitle, setPageTitle] = useState<string>('Dashboard');
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
      setPageTitle(title);
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
    <div className="w-full min-h-screen flex bg-gray-50">
      <div className="w-[17%]">
        <Sidebar />
      </div>

      <div className="w-full md:w-[83%] flex flex-col h-[100vh]">
        <Header />
        <main className="overflow-x-auto h-full w-full overflow-y-auto">
          <div className="w-full mx-auto">
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin h-8 w-8 text-primary-500" />
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <div
        className={`
          fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 lg:hidden
          transition-opacity duration-300
          ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileMenuOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;