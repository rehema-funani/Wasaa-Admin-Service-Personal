import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import SlimSidebar from "./LeftMenu";
import TopNavigation from "./TopNavigation";
import PageTitle from "../../elements/PageTitle";
import { BarChart3, ChevronRight } from "lucide-react";
import SystemHealthDashboard from "./SystemHealthDashboard";

const AdminLayout = () => {
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(1800);
  const [showGlobalMetrics, setShowGlobalMetrics] = useState(true);
  const [systemLoad, setSystemLoad] = useState(67);
  const [apiStatus, setApiStatus] = useState({ up: true, latency: 42 });
  const [showQuickTools, setShowQuickTools] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeRemaining((prev) => {
        if (prev <= 0) {
          return 10800;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTimer = setInterval(() => {
      setSystemLoad((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        const newValue = prev + change;
        return Math.max(45, Math.min(92, newValue));
      });

      setApiStatus((prev) => ({
        ...prev,
        latency: Math.max(
          15,
          Math.min(200, prev.latency + (Math.floor(Math.random() * 7) - 3))
        ),
      }));
    }, 5000);

    return () => clearInterval(loadTimer);
  }, []);

  return (
    <div className="relative flex h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <PageTitle />
      <SlimSidebar />

      <div className="flex-1 flex flex-col">
        <TopNavigation />

        {showGlobalMetrics && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm px-4 py-2 transition-all duration-300 mt-[70px]"></div>
        )}

        {!showGlobalMetrics && (
          <button
            onClick={() => setShowGlobalMetrics(true)}
            className="absolute z-20 left-[75px] mt-[75px] p-1.5 rounded-r-md bg-white dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/20 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <BarChart3
              size={14}
              className="text-primary-500 dark:text-primary-400"
            />
          </button>
        )}

        <div className="relative flex flex-1 overflow-hidden">
          <div
            className={`absolute top-0 left-4 h-full z-20 transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg dark:shadow-gray-900/30 border-r border-gray-200/50 dark:border-gray-700/50 ${
              showQuickTools ? "w-64" : "w-0"
            }`}
          >
            <div className="h-full overflow-y-auto">
              <SystemHealthDashboard />
            </div>

            <button
              className="absolute -right-4 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/20 rounded-r-md p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowQuickTools(!showQuickTools)}
            >
              <ChevronRight
                size={14}
                className={`text-primary-500 dark:text-primary-400 transition-transform duration-300 ${
                  showQuickTools ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <main
            className={`flex-1 mt-0 overflow-x-hidden overflow-y-auto p-6 transition-all duration-300 bg-gray-50 dark:bg-gray-900 ${
              showQuickTools ? "ml-64" : ""
            }`}
          >
            <div className="relative z-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Dark mode scrollbar styling */
        .dark .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Custom scrollbar for dark mode */
        .dark ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .dark ::-webkit-scrollbar-track {
          background: rgb(31 41 55);
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: rgb(75 85 99);
          border-radius: 3px;
        }
        
        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
