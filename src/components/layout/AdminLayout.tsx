import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import SlimSidebar from "./LeftMenu";
import TopNavigation from "./TopNavigation";
import PageTitle from "../../elements/PageTitle";
import {
  ArrowUp,
  ArrowDown,
  Shield,
  Clock,
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  DollarSign,
  RefreshCw,
  Activity,
  BarChart3,
  FileText,
  ChevronRight,
} from "lucide-react";
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
    <div className="relative flex h-screen transition-colors duration-300">
      <PageTitle />
      <SlimSidebar />

      <div className="flex-1 flex flex-col">
        <TopNavigation />

        {showGlobalMetrics && (
          <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm px-4 py-2 transition-all duration-300 mt-[70px]"></div>
        )}

        {!showGlobalMetrics && (
          <button
            onClick={() => setShowGlobalMetrics(true)}
            className="absolute z-20 left-[75px] mt-[75px] p-1.5 rounded-r-md bg-white border border-l-0 border-gray-200 shadow-md"
          >
            <BarChart3 size={14} className="text-primary-500" />
          </button>
        )}

        <div className="relative flex flex-1 overflow-hidden">
          <div
            className={`absolute top-0 left-4 h-full z-20 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-lg border-r border-gray-200/50 ${
              showQuickTools ? "w-64" : "w-0"
            }`}
          >
            <div className="h-full overflow-y-auto">
              <SystemHealthDashboard />
            </div>

            <button
              className="absolute -right-4 top-6 bg-white border border-gray-200 shadow-md rounded-r-md p-1.5"
              onClick={() => setShowQuickTools(!showQuickTools)}
            >
              <ChevronRight
                size={14}
                className={`text-primary-500 transition-transform duration-300 ${
                  showQuickTools ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <main
            className={`flex-1 mt-0 overflow-x-hidden overflow-y-auto p-6 transition-all duration-300 ${
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
      `}</style>
    </div>
  );
};

export default AdminLayout;
