import {
  Activity,
  Server,
  Shield,
  MessageSquare,
  Image,
  Users,
  GlassWater,
  Database,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Zap,
  Timer,
  Cpu,
  HeartPulse,
  Sun,
  Moon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function SystemHealthDashboard() {
  const { isDarkMode, toggleMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedService, setExpandedService] = useState(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return isDarkMode ? "text-emerald-400" : "text-emerald-500";
      case "degraded":
        return isDarkMode ? "text-amber-400" : "text-amber-500";
      case "down":
        return isDarkMode ? "text-red-400" : "text-red-500";
      default:
        return isDarkMode ? "text-gray-400" : "text-gray-500";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "operational":
        return isDarkMode
          ? "bg-emerald-800 text-emerald-200"
          : "bg-emerald-50 text-emerald-700";
      case "degraded":
        return isDarkMode
          ? "bg-amber-800 text-amber-200"
          : "bg-amber-50 text-amber-700";
      case "down":
        return isDarkMode
          ? "bg-red-800 text-red-200"
          : "bg-red-50 text-red-700";
      default:
        return isDarkMode
          ? "bg-gray-800 text-gray-200"
          : "bg-gray-50 text-gray-700";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "operational":
        return isDarkMode
          ? "from-emerald-800 to-emerald-900"
          : "from-emerald-50 to-emerald-100";
      case "degraded":
        return isDarkMode
          ? "from-amber-800 to-amber-900"
          : "from-amber-50 to-amber-100";
      case "down":
        return isDarkMode
          ? "from-red-800 to-red-900"
          : "from-red-50 to-red-100";
      default:
        return isDarkMode
          ? "from-gray-800 to-gray-900"
          : "from-gray-50 to-gray-100";
    }
  };

  const serviceIcons = {
    Auth: Shield,
    Wallets: Database,
    Support: Activity,
    Chat: MessageSquare,
    Media: Image,
    Contacts: Users,
    "API Gateway": GlassWater,
    Kafka: Server,
  };

  const systemHealthMetrics = [
    {
      name: "Auth",
      status: "degraded",
      uptime: "99.87%",
      responseTime: "245ms",
      cpu: "32%",
      memory: "68%",
      errorRate: "1.3%",
      requestsPerSec: "15.3",
      latency: "p95: 312ms",
      lastIncident: "3h 24m ago",
      nodeStatus: [
        { id: "auth-1", status: "operational" },
        { id: "auth-2", status: "degraded" },
        { id: "auth-3", status: "operational" },
      ],
    },
    {
      name: "Wallets",
      status: "operational",
      uptime: "99.998%",
      responseTime: "78ms",
      cpu: "24%",
      memory: "42%",
      errorRate: "0.02%",
      requestsPerSec: "8.5",
      latency: "p95: 103ms",
      lastIncident: "12d 5h ago",
      nodeStatus: [
        { id: "wallet-1", status: "operational" },
        { id: "wallet-2", status: "operational" },
        { id: "wallet-3", status: "operational" },
      ],
    },
    {
      name: "Support",
      status: "operational",
      uptime: "99.992%",
      responseTime: "156ms",
      cpu: "18%",
      memory: "35%",
      errorRate: "0.05%",
      requestsPerSec: "4.2",
      latency: "p95: 187ms",
      lastIncident: "6d 12h ago",
      nodeStatus: [
        { id: "support-1", status: "operational" },
        { id: "support-2", status: "operational" },
      ],
    },
    {
      name: "Chat",
      status: "operational",
      uptime: "99.995%",
      responseTime: "95ms",
      cpu: "28%",
      memory: "51%",
      errorRate: "0.03%",
      requestsPerSec: "26.4",
      latency: "p95: 112ms",
      lastIncident: "8d 3h ago",
      nodeStatus: [
        { id: "chat-1", status: "operational" },
        { id: "chat-2", status: "operational" },
        { id: "chat-3", status: "operational" },
        { id: "chat-4", status: "operational" },
      ],
    },
    {
      name: "Media",
      status: "down",
      uptime: "98.75%",
      responseTime: "842ms",
      cpu: "92%",
      memory: "87%",
      errorRate: "16.8%",
      requestsPerSec: "5.8",
      latency: "p95: 1.2s",
      lastIncident: "Current",
      nodeStatus: [
        { id: "media-1", status: "down" },
        { id: "media-2", status: "down" },
        { id: "media-3", status: "degraded" },
      ],
    },
    {
      name: "Contacts",
      status: "operational",
      uptime: "99.999%",
      responseTime: "68ms",
      cpu: "15%",
      memory: "32%",
      errorRate: "0.01%",
      requestsPerSec: "3.2",
      latency: "p95: 84ms",
      lastIncident: "18d 7h ago",
      nodeStatus: [
        { id: "contacts-1", status: "operational" },
        { id: "contacts-2", status: "operational" },
      ],
    },
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.996%",
      responseTime: "34ms",
      cpu: "42%",
      memory: "58%",
      errorRate: "0.04%",
      requestsPerSec: "72.1",
      latency: "p95: 45ms",
      lastIncident: "5d 18h ago",
      nodeStatus: [
        { id: "gateway-1", status: "operational" },
        { id: "gateway-2", status: "operational" },
        { id: "gateway-3", status: "operational" },
      ],
    },
    {
      name: "Kafka",
      status: "operational",
      uptime: "99.994%",
      responseTime: "12ms",
      cpu: "38%",
      memory: "62%",
      errorRate: "0.01%",
      requestsPerSec: "146.5",
      latency: "p95: 18ms",
      lastIncident: "3d 9h ago",
      nodeStatus: [
        { id: "kafka-1", status: "operational" },
        { id: "kafka-2", status: "operational" },
        { id: "kafka-3", status: "operational" },
      ],
    },
  ];

  const getTotalStatus = () => {
    if (systemHealthMetrics.some((metric) => metric.status === "down")) {
      return "down";
    } else if (
      systemHealthMetrics.some((metric) => metric.status === "degraded")
    ) {
      return "degraded";
    } else {
      return "operational";
    }
  };

  const toggleServiceExpansion = (index) => {
    if (expandedService === index) {
      setExpandedService(null);
    } else {
      setExpandedService(index);
    }
  };

  const handleRefresh = () => {
    setRefreshAnimation(true);
    setTimeout(() => setRefreshAnimation(false), 1000);
  };

  const getResponseTimeColor = (time) => {
    const ms = parseInt(time.replace("ms", ""));
    if (ms < 100) return isDarkMode ? "text-emerald-400" : "text-emerald-500";
    if (ms < 300) return isDarkMode ? "text-amber-400" : "text-amber-500";
    return isDarkMode ? "text-red-400" : "text-red-500";
  };

  const getCpuColor = (cpu) => {
    const percentage = parseInt(cpu.replace("%", ""));
    if (percentage < 50)
      return isDarkMode ? "text-emerald-400" : "text-emerald-500";
    if (percentage < 80)
      return isDarkMode ? "text-amber-400" : "text-amber-500";
    return isDarkMode ? "text-red-400" : "text-red-500";
  };

  return (
    <div
      className={`h-full overflow-y-auto ${
        isDarkMode ? "dark" : ""
      } bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700`}
      style={{ maxWidth: "256px" }}
    >
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <HeartPulse
              size={14}
              className="text-indigo-500 dark:text-indigo-400 mr-1"
            />
            <h2 className="text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              System Health
            </h2>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <button
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              onClick={toggleMode}
            >
              {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
            </button>
            <button
              className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${
                refreshAnimation ? "animate-spin" : ""
              }`}
              onClick={handleRefresh}
            >
              <RefreshCw
                size={12}
                className="text-indigo-400 dark:text-indigo-300"
              />
            </button>
          </div>
        </div>
        {/* Status Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-2 mb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center justify-between mb-1">
            <div
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBgColor(
                getTotalStatus()
              )} shadow-sm`}
            >
              {getTotalStatus() === "operational"
                ? "All Systems ✓"
                : getTotalStatus() === "degraded"
                ? "Partial Degradation"
                : "System Outage"}
            </div>
            <div className="text-xs flex space-x-1">
              <span className="px-1 bg-emerald-100 dark:bg-emerald-900 rounded text-emerald-700 dark:text-emerald-200 font-medium">
                {
                  systemHealthMetrics.filter((m) => m.status === "operational")
                    .length
                }
              </span>
              <span className="px-1 bg-amber-100 dark:bg-amber-900 rounded text-amber-700 dark:text-amber-200 font-medium">
                {
                  systemHealthMetrics.filter((m) => m.status === "degraded")
                    .length
                }
              </span>
              <span className="px-1 bg-red-100 dark:bg-red-900 rounded text-red-700 dark:text-red-200 font-medium">
                {systemHealthMetrics.filter((m) => m.status === "down").length}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="text-gray-500 dark:text-gray-400 flex items-center">
              <Clock size={10} className="mr-1" />
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Live
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          {systemHealthMetrics.map((service, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg border overflow-hidden transition-all duration-200 ${
                expandedService === index
                  ? "border-indigo-200 shadow-md hover:border-indigo-300 dark:border-indigo-800 dark:hover:border-indigo-700"
                  : "border-gray-100 dark:border-gray-700 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900"
              }`}
            >
              <div
                className={`p-2 flex items-center justify-between cursor-pointer bg-gradient-to-r ${
                  expandedService === index
                    ? "from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800"
                    : getStatusGradient(service.status)
                }`}
                onClick={() => toggleServiceExpansion(index)}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      service.status === "operational"
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : service.status === "degraded"
                        ? "bg-amber-500 dark:bg-amber-400"
                        : "bg-red-500 dark:bg-red-400"
                    } ${
                      service.status !== "operational" ? "animate-pulse" : ""
                    } shadow-sm`}
                  ></div>
                  <div className="flex items-center">
                    {React.createElement(serviceIcons[service.name], {
                      size: 12,
                      className:
                        expandedService === index
                          ? "text-indigo-500 dark:text-indigo-300"
                          : getStatusColor(service.status),
                    })}
                    <span
                      className={`ml-1 text-xs font-medium ${
                        expandedService === index
                          ? "text-indigo-700 dark:text-indigo-200"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {service.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-[10px] font-medium text-right">
                    <span
                      className={getResponseTimeColor(service.responseTime)}
                    >
                      {service.responseTime}
                    </span>
                  </div>
                  {expandedService === index ? (
                    <ChevronDown
                      size={12}
                      className="text-indigo-400 dark:text-indigo-300"
                    />
                  ) : (
                    <ChevronRight
                      size={12}
                      className="text-gray-400 dark:text-gray-300"
                    />
                  )}
                </div>
              </div>
              {expandedService === index && (
                <div className="p-2 pt-0 border-t border-gray-100 dark:border-gray-700 text-xs">
                  <div className="flex justify-end -mt-1 -mr-1 mb-1">
                    <div
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-bl-lg ${getStatusBgColor(
                        service.status
                      )}`}
                    >
                      {service.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">
                        <Timer size={8} className="mr-1" />
                        Response
                      </div>
                      <div
                        className={`font-medium ${getResponseTimeColor(
                          service.responseTime
                        )}`}
                      >
                        {service.responseTime}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">
                        <Cpu size={8} className="mr-1" />
                        CPU
                      </div>
                      <div
                        className={`font-medium ${getCpuColor(service.cpu)}`}
                      >
                        {service.cpu}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">
                        <Zap size={8} className="mr-1" />
                        Req/s
                      </div>
                      <div className="font-medium">
                        {service.requestsPerSec}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">
                        <AlertTriangle size={8} className="mr-1" />
                        Error Rate
                      </div>
                      <div
                        className={`font-medium ${
                          parseFloat(service.errorRate) > 1
                            ? "text-red-500 dark:text-red-400"
                            : parseFloat(service.errorRate) > 0.1
                            ? "text-amber-500 dark:text-amber-400"
                            : "text-emerald-500 dark:text-emerald-400"
                        }`}
                      >
                        {service.errorRate}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 px-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium text-indigo-500 dark:text-indigo-400">
                        Uptime:
                      </span>{" "}
                      {service.uptime}
                    </div>
                    <div>
                      <span className="font-medium text-indigo-500 dark:text-indigo-400">
                        Latency:
                      </span>{" "}
                      {service.latency}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1 flex items-center">
                    <Server size={8} className="mr-1" />
                    Nodes
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.nodeStatus.map((node) => (
                      <div
                        key={node.id}
                        className={`px-1.5 py-0.5 rounded-sm flex items-center text-[10px] ${
                          node.status === "operational"
                            ? "bg-emerald-50 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900"
                            : node.status === "degraded"
                            ? "bg-amber-50 dark:bg-amber-800 text-amber-700 dark:text-amber-200 border border-amber-100 dark:border-amber-900"
                            : "bg-red-50 dark:bg-red-800 text-red-700 dark:text-red-200 border border-red-100 dark:border-red-900"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            node.status === "operational"
                              ? "bg-emerald-500 dark:bg-emerald-400"
                              : node.status === "degraded"
                              ? "bg-amber-500 dark:bg-amber-400"
                              : "bg-red-500 dark:bg-red-400"
                          } ${
                            node.status !== "operational" ? "animate-pulse" : ""
                          }`}
                        ></div>
                        {node.id}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-indigo-500 dark:text-indigo-400">
                      Last incident:
                    </span>
                    <span
                      className={
                        service.status === "down"
                          ? "text-red-500 dark:text-red-400 font-medium"
                          : ""
                      }
                    >
                      {service.lastIncident}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
