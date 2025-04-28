import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
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
      document.title = `${title} | StreamPay Admin`;
    });

  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`
        flex-1 w-full flex flex-col h-[100vh] transition-all duration-300
      `}>
        <Header sidebarCollapsed={collapsed} />

        <main className="flex-1 overflow-x-hidden h-full overflow-y-auto">
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

        <Footer sidebarCollapsed={collapsed} />
      </div>

      <div
        className={`
          fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 lg:hidden
          transition-opacity duration-300
          ${!collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setCollapsed(true)}
      />
    </div>
  );
};

export default AdminLayout;