import {
  Activity,
  Server,
  Shield,
  MessageSquare,
  Image,
  Users,
  GlassWater,
  Database,
  ArrowUpCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Zap,
  Timer,
  Cpu,
  BarChart4,
  Gauge,
  PieChart,
  HeartPulse,
} from "lucide-react";
import React, { useState, useEffect } from "react";

export default function SystemHealthDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedService, setExpandedService] = useState(null);
  const [refreshAnimation, setRefreshAnimation] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper function for status color styling
  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "text-emerald-500";
      case "degraded":
        return "text-amber-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Helper function for status background styling
  const getStatusBgColor = (status) => {
    switch (status) {
      case "operational":
        return "bg-emerald-50 text-emerald-700";
      case "degraded":
        return "bg-amber-50 text-amber-700";
      case "down":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Helper function for status gradient styling
  const getStatusGradient = (status) => {
    switch (status) {
      case "operational":
        return "from-emerald-50 to-emerald-100";
      case "degraded":
        return "from-amber-50 to-amber-100";
      case "down":
        return "from-red-50 to-red-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  // Define service icons
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

  // Define detailed metrics for each service
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <ArrowUpCircle size={12} className="text-emerald-500" />;
      case "degraded":
        return <AlertTriangle size={12} className="text-amber-500" />;
      case "down":
        return <XCircle size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

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

  // Helper to get response time indicator color
  const getResponseTimeColor = (time) => {
    const ms = parseInt(time.replace("ms", ""));
    if (ms < 100) return "text-emerald-500";
    if (ms < 300) return "text-amber-500";
    return "text-red-500";
  };

  // Helper to get CPU usage indicator color
  const getCpuColor = (cpu) => {
    const percentage = parseInt(cpu.replace("%", ""));
    if (percentage < 50) return "text-emerald-500";
    if (percentage < 80) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div
      className="h-full overflow-y-auto bg-gray-50"
      style={{ maxWidth: "256px" }}
    >
      <div className="p-2">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <HeartPulse size={14} className="text-indigo-500 mr-1" />
            <h2 className="text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              System Health
            </h2>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <button
              className={`p-1 rounded-full hover:bg-gray-200 transition-all ${
                refreshAnimation ? "animate-spin" : ""
              }`}
              onClick={handleRefresh}
            >
              <RefreshCw size={12} className="text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 mb-3 bg-gradient-to-r from-gray-50 to-gray-100">
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
              <span className="px-1 bg-emerald-100 rounded text-emerald-700 font-medium">
                {
                  systemHealthMetrics.filter((m) => m.status === "operational")
                    .length
                }
              </span>
              <span className="px-1 bg-amber-100 rounded text-amber-700 font-medium">
                {
                  systemHealthMetrics.filter((m) => m.status === "degraded")
                    .length
                }
              </span>
              <span className="px-1 bg-red-100 rounded text-red-700 font-medium">
                {systemHealthMetrics.filter((m) => m.status === "down").length}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="text-gray-500 flex items-center">
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

        {/* Services List */}
        <div className="space-y-1.5">
          {systemHealthMetrics.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg border overflow-hidden transition-all duration-200 ${
                expandedService === index
                  ? "border-indigo-200 shadow-md"
                  : "border-gray-100 shadow-sm hover:border-indigo-100"
              }`}
            >
              {/* Service Header - Always visible */}
              <div
                className={`p-2 flex items-center justify-between cursor-pointer bg-gradient-to-r ${
                  expandedService === index
                    ? "from-indigo-50 to-indigo-100"
                    : getStatusGradient(service.status)
                }`}
                onClick={() => toggleServiceExpansion(index)}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      service.status === "operational"
                        ? "bg-emerald-500"
                        : service.status === "degraded"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    } ${
                      service.status !== "operational" ? "animate-pulse" : ""
                    } shadow-sm`}
                  ></div>

                  <div className="flex items-center">
                    {React.createElement(serviceIcons[service.name], {
                      size: 12,
                      className:
                        expandedService === index
                          ? "text-indigo-500"
                          : getStatusColor(service.status),
                    })}
                    <span
                      className={`ml-1 text-xs font-medium ${
                        expandedService === index
                          ? "text-indigo-700"
                          : "text-gray-700"
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
                    <ChevronDown size={12} className="text-indigo-400" />
                  ) : (
                    <ChevronRight size={12} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Service Details */}
              {expandedService === index && (
                <div className="p-2 pt-0 border-t border-gray-100 text-xs">
                  {/* Service Status Badge */}
                  <div className="flex justify-end -mt-1 -mr-1 mb-1">
                    <div
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-bl-lg ${getStatusBgColor(
                        service.status
                      )}`}
                    >
                      {service.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div className="bg-gray-50 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 text-[10px] mb-0.5">
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
                    <div className="bg-gray-50 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 text-[10px] mb-0.5">
                        <Cpu size={8} className="mr-1" />
                        CPU
                      </div>
                      <div
                        className={`font-medium ${getCpuColor(service.cpu)}`}
                      >
                        {service.cpu}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 text-[10px] mb-0.5">
                        <Zap size={8} className="mr-1" />
                        Req/s
                      </div>
                      <div className="font-medium">
                        {service.requestsPerSec}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-1.5 rounded">
                      <div className="flex items-center text-gray-500 text-[10px] mb-0.5">
                        <AlertTriangle size={8} className="mr-1" />
                        Error Rate
                      </div>
                      <div
                        className={`font-medium ${
                          parseFloat(service.errorRate) > 1
                            ? "text-red-500"
                            : parseFloat(service.errorRate) > 0.1
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {service.errorRate}
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="flex justify-between mb-2 px-1 text-[10px] text-gray-500">
                    <div>
                      <span className="font-medium text-indigo-500">
                        Uptime:
                      </span>{" "}
                      {service.uptime}
                    </div>
                    <div>
                      <span className="font-medium text-indigo-500">
                        Latency:
                      </span>{" "}
                      {service.latency}
                    </div>
                  </div>

                  {/* Node Status */}
                  <div className="text-[10px] text-gray-500 uppercase font-semibold mb-1 flex items-center">
                    <Server size={8} className="mr-1" />
                    Nodes
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.nodeStatus.map((node) => (
                      <div
                        key={node.id}
                        className={`px-1.5 py-0.5 rounded-sm flex items-center text-[10px] ${
                          node.status === "operational"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : node.status === "degraded"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            node.status === "operational"
                              ? "bg-emerald-500"
                              : node.status === "degraded"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          } ${
                            node.status !== "operational" ? "animate-pulse" : ""
                          }`}
                        ></div>
                        {node.id}
                      </div>
                    ))}
                  </div>

                  {/* Last Incident */}
                  <div className="mt-2 pt-1 border-t border-gray-100 text-[10px] text-gray-500">
                    <span className="font-medium text-indigo-500">
                      Last incident:
                    </span>
                    <span
                      className={
                        service.status === "down"
                          ? "text-red-500 font-medium"
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
